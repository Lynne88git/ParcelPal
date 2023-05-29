using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace ParcelPal.Models
{
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

        private static List<Item> ParseItemList(string itemListString)
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

        private static List<Item> SelectOptimalItems(double weightLimit, List<Item> items)
        {
            List<Item> chosenItems = new List<Item>();

            // Sort the items by their cost-to-weight ratio in descending order
            items.Sort((x, y) => y.CostToWeightRatio.CompareTo(x.CostToWeightRatio));

            double currentWeight = 0;

            // Iterate through the sorted items and select the ones that fit within the weight limit
            foreach (Item item in items)
            {
                if (currentWeight + item.Weight <= weightLimit)
                {
                    chosenItems.Add(item);
                    currentWeight += item.Weight;
                }
            }

            return chosenItems;
        }

        private static string GenerateSolutionString(List<Item> chosenItems)
        {
            StringBuilder solutionBuilder = new StringBuilder();

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

        public double CostToWeightRatio => Cost / Weight;

        public Item(int index, double weight, int cost)
        {
            Index = index;
            Weight = weight;
            Cost = cost;
        }
    }
}
