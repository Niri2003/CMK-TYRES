import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import specifically as 'autoTable'

export const generateInvoice = (order) => {
  try {
    const doc = new jsPDF();
    
    // Logic to handle services data
    let serviceList = [];
    try {
      serviceList = typeof order.services === 'string' ? JSON.parse(order.services) : order.services;
    } catch (e) {
      serviceList = [];
    }

    // --- 1. HEADER ---
    doc.setFillColor(0, 84, 166);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("CMK AUTO SERVICES", 14, 25);

    // --- 2. DETAILS ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Invoice: #CMK-${order.id}`, 14, 50);
    doc.text(`Customer: ${order.customer_name}`, 14, 56);
    doc.text(`Date: ${order.service_date.split('T')[0]}`, 14, 62);

    // --- 3. THE TABLE (The Fix is here) ---
    // Use the autoTable function directly instead of doc.autoTable
    autoTable(doc, {
      startY: 75,
      head: [['Service Description', 'Price (INR)']],
      body: serviceList.map(s => [
        s.service || s.title, 
        `Rs. ${parseFloat(s.price || 0).toLocaleString()}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 84, 166] }
    });

    // --- 4. TOTAL ---
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL AMOUNT: Rs. ${parseFloat(order.total_price).toLocaleString()}`, 195, finalY, { align: 'right' });

    doc.save(`Invoice_CMK_${order.id}.pdf`);

  } catch (error) {
    console.error("PDF Error:", error);
    alert("Invoice Error: " + error.message);
  }
};