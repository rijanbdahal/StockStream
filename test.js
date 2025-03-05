const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateWarehouseLocations() {
    // Update aisles to range from GA to GZ
    const aisles = [
        'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ',
        'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT',
        'GU', 'GV', 'GW', 'GX', 'GY', 'GZ'
    ];

    // Generate column numbers (10, 11, 20, 21, ..., 90, 91)
    const columnNumbers = [];
    for (let i = 10; i <= 90; i += 10) {
        columnNumbers.push(i);
        columnNumbers.push(i + 1); // Adding i+1 to cover the 'i+1' pattern (11, 21, ...)
    }

    // Generate row numbers (10, 20, 30, ..., 90)
    const rowNumbers = [];
    for (let i = 10; i <= 90; i += 10) {
        rowNumbers.push(i);
    }

    const warehouseLocations = [];

    aisles.forEach(aisle => {
        rowNumbers.forEach(rowNumber => {
            columnNumbers.forEach(columnNumber => {
                const locationId = `${aisle}${columnNumber}${rowNumber}`;
                const checkDigit = Math.floor(Math.random() * 1000); // Random checkDigit
                const status = Math.random() > 0.5; // Random status (true or false)

                warehouseLocations.push({
                    aisle: aisle,
                    locationId: locationId,
                    columnNumber: columnNumber,
                    rowNumber: rowNumber,
                    checkDigit: checkDigit,
                    status: status
                });
            });
        });
    });

    // Convert the array to a JSON string and save it to a .txt file
    const jsonData = JSON.stringify(warehouseLocations, null, 2);
    fs.writeFileSync('warehouse_locations.txt', jsonData);

    // Create a PDF using PDFKit
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('warehouse_locations.pdf'));

    doc.text("Warehouse Locations", { align: 'center' });
    warehouseLocations.forEach((location, index) => {
        const line = `Aisle: ${location.aisle}, Location ID: ${location.locationId}, Column: ${location.columnNumber}, Row: ${location.rowNumber}, Check Digit: ${location.checkDigit}, Status: ${location.status ? 'Active' : 'Inactive'}`;
        doc.text(line, 100, 50 + (index * 15)); // Position the text with some spacing
    });

    doc.end();
}

generateWarehouseLocations();
