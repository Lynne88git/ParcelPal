using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace ParcelPal.Models
{
    public class ParcelRequest
    {
        public double WeightLimit { get; set; }
        public string ItemList { get; set; } = string.Empty; // Setting default value to empty string
    }

    public class Packer
    {
        public static string Pack(string filePath)
        {

            // Read all lines from the input file
            string[] lines = File.ReadAllLines(filePath);

            // Create a StringBuilder to store the solution
            StringBuilder solutionBuilder = new StringBuilder();

            // Process each line
            foreach (string line in lines)
            {
                // Split the line at the colon to separate weight limit and item list
                string[] parts = line.Split(':');

                // Trim any leading or trailing whitespace from the weight limit
                string weightLimitString = parts[0].Trim();
                double weightLimit = double.Parse(weightLimitString);

                // Extract the item list part of the line
                string itemListString = parts[1].Trim();

                // Parse the item list and extract individual item details
                List<Item> items = ParseItemList(itemListString);

                // Select the optimal items based on weight (and cost tba) constraints
                List<Item> chosenItems = SelectOptimalItems(weightLimit, items);

                // Generate the solution string for the chosen items
                string solution = GenerateSolutionString(chosenItems);

                // Add the solution to the overall solution string
                solutionBuilder.AppendLine(solution);
            }

            // Returning the solution as a string
            return solutionBuilder.ToString().TrimEnd();

        }

        public static List<Item> ParseItemList(string itemListString)
        {
            List<Item> items = new List<Item>();

            // Use regular expressions to extract individual item details
            string pattern = @"\((\d+),([\d.]+),€([\d.]+)\)";
            MatchCollection matches = Regex.Matches(itemListString, pattern);

            // Process each match and create Item objects
            foreach (Match match in matches)
            {
                int index = int.Parse(match.Groups[1].Value);
                double weight = double.Parse(match.Groups[2].Value);
                int cost = int.Parse(match.Groups[3].Value);

                Item item = new Item(index, weight, cost);
                items.Add(item);
            }

            return items;
        }

        public static List<Item> SelectOptimalItems(double weightLimit, List<Item> items)
        {
            int itemCount = items.Count;
            double[,] dp = new double[itemCount + 1, (int)weightLimit + 1];

            // Initialize the dynamic programming table
            for (int i = 0; i <= itemCount; i++)
            {
                for (int w = 0; w <= weightLimit; w++)
                {
                    if (i == 0 || w == 0)
                        dp[i, w] = 0;
                    else if (items[i - 1].Weight <= w)
                        dp[i, w] = Math.Max(items[i - 1].Cost + dp[i - 1, (int)(w - items[i - 1].Weight)], dp[i - 1, w]);
                    else
                        dp[i, w] = dp[i - 1, w];
                }
            }


            // Find the selected items by backtracking through the dynamic programming table
            List<Item> chosenItems = new List<Item>();
            int itemIndex = itemCount;
            double remainingWeight = weightLimit;

            while (itemIndex > 0 && remainingWeight > 0)
            {
                if (dp[itemIndex, (int)remainingWeight] != dp[itemIndex - 1, (int)remainingWeight])
                {
                    Item selectedItem = items[itemIndex - 1];
                    chosenItems.Add(selectedItem);
                    remainingWeight -= selectedItem.Weight;
                }

                itemIndex--;
            }

            chosenItems.Reverse(); // Reverse the list to match the expected output order

            return chosenItems;
        }

        public static string GenerateSolutionString(List<Item> chosenItems)
        {
            StringBuilder solutionBuilder = new StringBuilder();

            // Sort the chosen items by index in ascending order
            chosenItems.Sort((x, y) => x.Index.CompareTo(y.Index));

            // Add chosen item indices to the solution
            foreach (Item item in chosenItems)
            {
                solutionBuilder.Append(item.Index);
                solutionBuilder.Append(",");
            }

            // Trim the trailing comma and return the solution as a string
            return solutionBuilder.ToString().TrimEnd(',');
        }
    }

    public class Item
    {
        public int Index { get; }

        public double Weight { get; }
        public int Cost { get; }

        //public double CostToWeightRatio => Cost / Weight;

        public Item(int index, double weight, int cost)
        {
            Index = index;
            Weight = weight;
            Cost = cost;
        }
    }
}
