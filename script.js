const invoiceForm = document.getElementById('invoiceForm');
const invoiceTableBody = document.getElementById('invoiceTableBody');
const totalAmountSpan = document.getElementById('totalAmount');
const printPdfButton = document.getElementById('printPdfButton');

// Variables for state
let totalAmount = 0;
let customerNameForPdf = "";

// Handle form submission
invoiceForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const customerNameInput = document.getElementById('customerName');
    const productName = document.getElementById('productName').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);

    // Persist customer name for PDF
    const customerName = customerNameInput.value.trim();
    if (!customerNameForPdf) {
        customerNameForPdf = customerName;
    }

    // Calculate total
    const total = quantity * unitPrice;

    totalAmount += total;
    totalAmountSpan.textContent = totalAmount.toFixed(2);

    // Add a row to the table
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${customerName}</td>
        <td>${productName}</td>
        <td>${quantity} ${unit}</td>
        <td>${unit}</td>
        <td>${unitPrice.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
    `;
    invoiceTableBody.appendChild(row);

    // Clear product fields
    document.getElementById('productName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unitPrice').value = '';
});

// Handle PDF generation
printPdfButton.addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = 'logo.png'; // Path to your logo

    logo.onload = function () {
        doc.addImage(logo, 'PNG', 80, 10, 50, 20);
        doc.setFontSize(18);
        doc.text('Radha and Aadarsha Khadyanna', 105, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Butwal-11, Buddhanagar, Rupandehi, Nepal', 105, 48, { align: 'center' });
        doc.text('Contact: +977 9804481062', 105, 54, { align: 'center' });

        doc.text(`Customer Name: ${customerNameForPdf}`, 10, 70);

        let yPosition = 80;
        doc.setFont("helvetica", "bold");
        doc.text('Product', 10, yPosition);
        doc.text('Quantity', 70, yPosition);
        doc.text('Unit', 110, yPosition);
        doc.text('Unit Price', 140, yPosition);
        doc.text('Total', 180, yPosition);

        yPosition += 10;
        const rows = invoiceTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            doc.setFont("helvetica", "normal");
            doc.text(cells[1].textContent, 10, yPosition);
            doc.text(cells[2].textContent, 70, yPosition);
            doc.text(cells[3].textContent, 110, yPosition);
            doc.text(cells[4].textContent, 140, yPosition);
            doc.text(cells[5].textContent, 180, yPosition);
            yPosition += 10;
        });

        doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 10, yPosition + 10);

        doc.save('invoice_with_logo.pdf');
    };
});
