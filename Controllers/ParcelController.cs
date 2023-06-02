using Microsoft.AspNetCore.Mvc;
using ParcelPal.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ParcelPal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParcelController : ControllerBase
    {
        [HttpPost("pack")]
        public IActionResult PackItems([FromBody] ParcelRequest request)
        {
            try
            {
                // Extract the weight limit and item list from the request
                double weightLimit = request.WeightLimit;
                string itemListString = request.ItemList;

                // Parse the item list and extract individual item details
                List<Item> items = Packer.ParseItemList(itemListString);

                // Select the optimal items based on weight limit
                List<Item> chosenItems = Packer.SelectOptimalItems(weightLimit, items);

                // Generate the solution string for the chosen items
                string solution = Packer.GenerateSolutionString(chosenItems);

                // Convert the solution string to a byte array
                byte[] solutionBytes = Encoding.UTF8.GetBytes(solution);

                // Return the solution as a text file named "input.txt"
                return File(solutionBytes, "text/plain", "input.txt");
            }
            catch (Exception ex)
            {
                // Return an error response if any exception occurs
                return BadRequest(ex.Message);
            }
        }
    }
}
