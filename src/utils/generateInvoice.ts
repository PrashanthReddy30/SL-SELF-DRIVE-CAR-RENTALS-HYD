import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Booking, Car } from '../types';

export const generateInvoice = (booking: Booking, car: Car | undefined) => {
  if (!car) {
    console.error("Car details not found for invoice.");
    return;
  }

  const doc = new jsPDF();
  const invoiceNumber = `INV-${booking.id.substring(0, 8).toUpperCase()}`;
  const date = new Date().toLocaleDateString();

  // Header / Branding
  doc.setFillColor(239, 68, 68); // Primary Color (red-500)
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SL Self Drive', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Car Rentals & Services', 15, 32);

  // Invoice Title & Details
  doc.setTextColor(239, 68, 68);
  doc.setFontSize(28);
  doc.text('INVOICE', 140, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoiceNumber}`, 140, 32);

  // Company Details
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text('Nagaram Main Road, Opp to Masjid', 15, 55);
  doc.text('Nagaram, Keesara Mandal', 15, 60);
  doc.text('Medchal - Malkajgiri - 500083', 15, 65);
  doc.text('Phone: +91 8106698859', 15, 70);
  doc.text('Email: info@slrentals.com', 15, 75);

  // Billed To
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.customerName, 120, 60);
  doc.text(`Phone: ${booking.customerPhone}`, 120, 65);
  doc.text(`Aadhaar: ${booking.aadharNumber || 'N/A'}`, 120, 70);
  doc.text(`Date of Issue: ${date}`, 120, 75);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 85, 195, 85);

  // Trip Details
  doc.setFont('helvetica', 'bold');
  doc.text('TRIP DETAILS', 15, 95);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Vehicle: ${car.name} (${car.category} - ${car.transmission})`, 15, 105);
  doc.text(`Fuel Type: ${car.fuelType}`, 15, 112);
  doc.text(`Pickup Location: ${booking.pickupLocation}`, 15, 119);
  
  const startDate = new Date(booking.startDate).toLocaleDateString();
  const endDate = new Date(booking.endDate).toLocaleDateString();
  
  // Calculate Days
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  doc.text(`Trip Duration: ${diffDays} Day(s)`, 120, 105);
  doc.text(`Start Date: ${startDate}`, 120, 112);
  doc.text(`End Date: ${endDate}`, 120, 119);

  // Table
  autoTable(doc, {
    startY: 135,
    head: [['Description', 'Days', 'Rate / Day', 'Total']],
    body: [
      [`Self-Drive Rental: ${car.name}`, diffDays.toString(), `Rs. ${car.pricePerDay}`, `Rs. ${booking.totalPrice}`],
    ],
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 160;

  // Total Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 140, finalY + 15);
  doc.setTextColor(239, 68, 68);
  doc.text(`Rs. ${booking.totalPrice.toLocaleString()}`, 170, finalY + 15);

  // Footer / Terms
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const termsText = 'Terms & Conditions apply. Tolls, parking, and traffic fines are the responsibility of the renter. This is a computer-generated invoice.';
  
  const splitTerms = doc.splitTextToSize(termsText, 180);
  doc.text(splitTerms, 15, 280);

  // Save the PDF
  doc.save(`SL_Self_Drive_Invoice_${invoiceNumber}.pdf`);
};
