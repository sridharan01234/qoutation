import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    // Create PDF document
    const doc = new jsPDF();
    
    // Header section
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text("QUOTATION", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

    // Company details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Left side info
    doc.text("From:", 20, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Your Company Name", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text("123 Business Street", 20, 60);
    doc.text("City, Country", 20, 65);
    doc.text("Phone: +1 234 567 890", 20, 70);

    // Right side info
    doc.text("Quotation Details:", doc.internal.pageSize.getWidth() - 90, 50);
    doc.text(`Number: ${quotation.quotationNumber}`, doc.internal.pageSize.getWidth() - 90, 55);
    doc.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 90, 60);
    doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 90, 65);

    // Customer information
    doc.text("To:", 20, 85);
    doc.setFont("helvetica", "bold");
    doc.text(quotation.creater.name || "Customer Name", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(quotation.creater.email || "", 20, 95);

    // Items table
    const tableColumns = [
      "Item",
      "SKU",
      "Quantity",
      "Unit Price",
      "Total"
    ];
    
    const tableRows = quotation.items.map((item: any) => [
      item.product.name,
      item.product.sku,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      startY: 110,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 5
      },
      margin: { left: 20, right: 20 }
    });

    // Summary section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Summary box
    doc.setDrawColor(44, 62, 80);
    doc.setFillColor(249, 249, 249);
    doc.rect(doc.internal.pageSize.getWidth() - 90, finalY, 70, 50, 'FD');

    // Summary details
    let summaryY = finalY + 10;
    
    // Helper function for summary items
    const addSummaryItem = (label: string, value: number) => {
      doc.text(label, doc.internal.pageSize.getWidth() - 85, summaryY);
      doc.text(`$${value.toFixed(2)}`, doc.internal.pageSize.getWidth() - 30, summaryY, { align: "right" });
      summaryY += 8;
    };

    addSummaryItem("Subtotal:", quotation.subtotal);
    addSummaryItem(`Tax (${(quotation.taxRate * 100).toFixed(0)}%):`, quotation.taxAmount);
    addSummaryItem("Discount:", quotation.discount);
    addSummaryItem("Shipping:", quotation.shippingCost);

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total:", doc.internal.pageSize.getWidth() - 85, summaryY);
    doc.text(
      `$${quotation.totalAmount.toFixed(2)}`,
      doc.internal.pageSize.getWidth() - 30,
      summaryY,
      { align: "right" }
    );

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Thank you for your business!",
      doc.internal.pageSize.getWidth() / 2,
      footerY,
      { align: "center" }
    );

    // Return PDF as response
    const pdfOutput = doc.output('arraybuffer');
    return new Response(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Error generating PDF" }, { status: 500 });
  }
}
