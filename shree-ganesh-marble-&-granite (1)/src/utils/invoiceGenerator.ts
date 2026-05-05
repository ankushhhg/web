import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  items: any[];
  totalAmount: number;
  date: string;
  paymentMethod: string;
  paymentStatus: string;
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('serif', 'bold');
  doc.text('SHREE GANESH MARBLE & GRANITE', 20, 25);
  
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(10);
  doc.text('INVOICE / PRO-FORMA', 160, 25);
  
  // Customer Details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.customerName, 20, 62);
  doc.text(data.customerEmail, 20, 67);
  doc.text(data.customerMobile, 20, 72);
  
  // Order Details
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details:', 140, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${data.orderId.slice(0, 12)}`, 140, 62);
  doc.text(`Date: ${data.date}`, 140, 67);
  doc.text(`Method: ${data.paymentMethod.toUpperCase()}`, 140, 72);
  doc.text(`Status: ${data.paymentStatus.toUpperCase()}`, 140, 77);
  
  // Table
  const tableColumn = ["Item Description", "Unit Price (sqft)", "Quantity", "Subtotal"];
  const tableRows = data.items.map(item => [
    item.name,
    `INR ${(item.price || 0).toLocaleString()}`,
    `${item.quantity} sqft`,
    `INR ${((item.price || 0) * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    theme: 'grid',
    headStyles: { fillColor: [180, 83, 9], fontSize: 10 }, // amber-700
    styles: { fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Summary
  doc.setFont('helvetica', 'bold');
  doc.text(`Subtotal: INR ${(data.totalAmount / 1.18).toFixed(2)}`, 140, finalY);
  doc.text(`GST (18%): INR ${(data.totalAmount - (data.totalAmount / 1.18)).toFixed(2)}`, 140, finalY + 7);
  
  doc.setFillColor(248, 250, 252);
  doc.rect(138, finalY + 12, 60, 15, 'F');
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(14);
  doc.text(`Total: INR ${data.totalAmount.toLocaleString()}`, 140, finalY + 22);
  
  // Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('This is a computer generated document. Official payment links will be shared via WhatsApp/Email.', 20, 280);
  doc.text('Thank you for choosing Shree Ganesh Marble & Granite Company.', 20, 285);
  
  doc.save(`SG_Invoice_${data.orderId.slice(0, 6)}.pdf`);
};
