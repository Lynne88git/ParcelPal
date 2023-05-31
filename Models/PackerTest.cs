using NUnit.Framework;
using ParcelPal.Models;

namespace ParcelPal.Tests
{
    [TestFixture]
    public class PackerTests
    {
        private const string TestFilePath = "path/to/your/test/file.txt";

        [Test]
        public void Pack_ReturnsCorrectSolution()
        {
            // Arrange
            string expectedSolution = "expected solution";

            // Act
            string actualSolution = Packer.Pack(TestFilePath);

            // Assert
            Assert.AreEqual(expectedSolution, actualSolution);
        }

    }
}