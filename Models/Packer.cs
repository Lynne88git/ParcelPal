using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace ParcelPal.Models
{
    public class Packer
    {
        public static string Pack(string filePath)
        {

            // Read all lines from the input file
            string[] lines = File.ReadAllLines(filePath);

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

                // TODO: Implement the logic to select the optimal items based on weight and cost constraints
            }

            // TODO: Return the solution as a string

            throw new NotImplementedException();
        }

        private static List<Item> ParseItemList(string itemListString)
        {
            List<Item> items = new List<Item>();

            // Use regular expressions to extract individual item details
            string pattern = @"\((\d+),([\d.]+),€(\d+)\)";
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

        // TODO: Implement the logic to select the optimal items based on weight and cost constraints

        // TODO: Implement the method to generate the solution string
    }

    public class Item
    {
        public int Index { get; }
        public double Weight { get; }
        public int Cost { get; }

        public Item(int index, double weight, int cost)
        {
            Index = index;
            Weight = weight;
            Cost = cost;
        }
    }
}
