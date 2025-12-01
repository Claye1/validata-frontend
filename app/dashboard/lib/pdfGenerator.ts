import jsPDF from 'jspdf';

interface ValidationData {
  score: number;
  total_issues: number;
  issues: {
    missing_values: number;
    duplicate_rows: number;
    type_errors: number;
    out_of_range: number;
    invalid_patterns: number;
    outliers: number;
  };
  details: any;
  created_at: string;
  dataset_id: number;
}

interface DatasetInfo {
  filename: string;
  rows: number;
}

export const generateValidationReport = (
  validationData: ValidationData,
  datasetInfo: DatasetInfo
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;

  // Header - Branding
  pdf.setFillColor(79, 70, 229); // Indigo
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('VALIDATA', 20, 20);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Data Quality Validation Report', 20, 26);

  yPosition = 45;

  // Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Validation Report', 20, yPosition);
  yPosition += 10;

  // Dataset Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Dataset: ${datasetInfo.filename}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Rows: ${datasetInfo.rows.toLocaleString()}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 15;

  // Quality Score Box
  const scoreColor = validationData.score >= 90 ? [34, 197, 94] : 
                     validationData.score >= 70 ? [234, 179, 8] : 
                     [239, 68, 68];
  
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1);
  pdf.roundedRect(20, yPosition, 170, 30, 3, 3, 'F');
  
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Quality Score', 30, yPosition + 12);
  pdf.setFontSize(28);
  pdf.text(`${validationData.score}%`, 30, yPosition + 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const statusText = validationData.score >= 90 ? 'Excellent Quality' :
                     validationData.score >= 70 ? 'Good Quality' :
                     'Needs Improvement';
  pdf.text(statusText, 120, yPosition + 18);
  
  yPosition += 40;

  // Issues Summary
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Issues Detected', 20, yPosition);
  yPosition += 10;

  const issues = [
    { name: 'Missing Values', count: validationData.issues.missing_values, severity: 'High' },
    { name: 'Duplicate Rows', count: validationData.issues.duplicate_rows, severity: 'Medium' },
    { name: 'Type Errors', count: validationData.issues.type_errors, severity: 'High' },
    { name: 'Out of Range', count: validationData.issues.out_of_range, severity: 'Medium' },
    { name: 'Invalid Patterns', count: validationData.issues.invalid_patterns, severity: 'Low' },
    { name: 'Outliers', count: validationData.issues.outliers, severity: 'Low' },
  ];

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Issue Type', 25, yPosition);
  pdf.text('Count', 100, yPosition);
  pdf.text('Severity', 140, yPosition);
  yPosition += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, 190, yPosition);
  yPosition += 7;

  pdf.setFont('helvetica', 'normal');
  issues.forEach((issue) => {
    pdf.text(issue.name, 25, yPosition);
    pdf.text(issue.count.toString(), 100, yPosition);
    
    const severityColor = issue.severity === 'High' ? [239, 68, 68] :
                          issue.severity === 'Medium' ? [234, 179, 8] :
                          [234, 179, 8];
    pdf.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    pdf.text(issue.severity, 140, yPosition);
    pdf.setTextColor(0, 0, 0);
    
    yPosition += 8;
  });

  yPosition += 10;

  // Summary
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPosition, 170, 12, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total Issues: ${validationData.total_issues}`, 25, yPosition + 8);

  yPosition += 20;

  // Recommendations
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommendations', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const recommendations = [];
  if (validationData.issues.missing_values > 0) {
    recommendations.push(`• Address ${validationData.issues.missing_values} missing values before production use`);
  }
  if (validationData.issues.type_errors > 0) {
    recommendations.push(`• Fix ${validationData.issues.type_errors} type errors to ensure data consistency`);
  }
  if (validationData.issues.duplicate_rows > 0) {
    recommendations.push(`• Remove ${validationData.issues.duplicate_rows} duplicate rows to improve accuracy`);
  }
  if (validationData.score >= 90) {
    recommendations.push('• Data quality is excellent and ready for production use');
  }

  recommendations.forEach((rec) => {
    const lines = pdf.splitTextToSize(rec, 165);
    pdf.text(lines, 25, yPosition);
    yPosition += lines.length * 6;
  });

  // Footer - Certificate
  const footerY = pageHeight - 40;
  pdf.setDrawColor(79, 70, 229);
  pdf.setLineWidth(0.5);
  pdf.line(20, footerY, pageWidth - 20, footerY);
  
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This report certifies that the dataset has been validated using Validata\'s automated quality assessment engine.', pageWidth / 2, footerY + 8, { align: 'center' });
  pdf.text(`Report ID: VAL-${validationData.dataset_id}-${Date.now()}`, pageWidth / 2, footerY + 14, { align: 'center' });
  pdf.text(`Generated by Validata | ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 20, { align: 'center' });

  // Save PDF
  const filename = `Validata_Report_${datasetInfo.filename.replace('.csv', '')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};