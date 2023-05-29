using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;


namespace ParcelPal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ParcelController : ControllerBase
    {
        private readonly ILogger<ParcelController> _logger;

        public ParcelController(ILogger<ParcelController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Parcel>> Get(string filePath)
        {
           try
            {
                // Read the JSON content from the specified file path
                string jsonContent = System.IO.File.ReadAllText(filePath);

                // Deserialise JSON content into a list of Parcel objects
                List<Parcel> parcels = JsonSerializer.Deserialize<List<Parcel>>(jsonContent);

                return Ok(parcels);
            }
            catch (Exception ex)
            {
                // Handle file reading errors
                _logger.LogError(ex, "Error occurred while reading the file.");
                return StatusCode(500, "An error occurred while reading the file.");
            }
        }
    }
    public class Parcel
    {
        public int SampleParcelWeight { get; set; }
        public List<Item> Items { get; set; }
    }

    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Quantity { get; set; }
        public string Price { get; set; }
    }
}