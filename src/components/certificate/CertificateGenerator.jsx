import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Award } from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

const CertificateGenerator = ({ studentName, courseName, instructorName, date, certificateId }) => {
    const canvasRef = useRef(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        generateQRCode();
    }, [certificateId]);

    useEffect(() => {
        if (qrCodeUrl) {
            drawCertificate();
        }
    }, [qrCodeUrl, studentName, courseName]);

    const generateQRCode = async () => {
        try {
            const url = `https://ai-lms.demo/verify/${certificateId}`;
            const qr = await QRCode.toDataURL(url);
            setQrCodeUrl(qr);
        } catch (err) {
            console.error(err);
        }
    };

    const drawCertificate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f3f4f6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 20;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Inner Border
        ctx.strokeStyle = '#c7d2fe';
        ctx.lineWidth = 5;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        // Header
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 60px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', width / 2, 150);

        // Subheader
        ctx.fillStyle = '#6b7280';
        ctx.font = '30px "Inter", sans-serif';
        ctx.fillText('This is to certify that', width / 2, 220);

        // Student Name
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold italic 70px "Inter", sans-serif';
        ctx.fillText(studentName, width / 2, 320);

        // Course Text
        ctx.fillStyle = '#6b7280';
        ctx.font = '30px "Inter", sans-serif';
        ctx.fillText('has successfully completed the course', width / 2, 400);

        // Course Name
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 50px "Inter", sans-serif';
        ctx.fillText(courseName, width / 2, 480);

        // Date & Signature Line
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;

        // Date
        ctx.beginPath();
        ctx.moveTo(150, 650);
        ctx.lineTo(450, 650);
        ctx.stroke();

        ctx.fillStyle = '#374151';
        ctx.font = '24px "Inter", sans-serif';
        ctx.fillText(new Date(date).toLocaleDateString(), 300, 640);
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px "Inter", sans-serif';
        ctx.fillText('Date Issued', 300, 680);

        // Signature
        ctx.beginPath();
        ctx.moveTo(width - 450, 650);
        ctx.lineTo(width - 150, 650);
        ctx.stroke();

        ctx.fillStyle = '#374151';
        ctx.font = 'italic 30px "Cursive", serif';
        ctx.fillText(instructorName, width - 300, 640);
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px "Inter", sans-serif';
        ctx.fillText('Instructor', width - 300, 680);

        // QR Code
        if (qrCodeUrl) {
            const img = new Image();
            img.src = qrCodeUrl;
            img.onload = () => {
                ctx.drawImage(img, width / 2 - 50, 600, 100, 100);
            };
        }

        // Logo/Icon
        ctx.fillStyle = '#4f46e5';
        ctx.font = '40px serif';
        ctx.fillText('🎓 AI LMS', width / 2, 750);
    };

    const downloadPDF = () => {
        const canvas = canvasRef.current;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`certificate-${certificateId}.pdf`);
    };

    return (
        <div className="certificate-generator">
            <div className="certificate-preview">
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
            </div>

            <div className="certificate-actions">
                <button onClick={downloadPDF} className="btn btn-primary btn-lg">
                    <Download size={20} />
                    Download PDF
                </button>
                <button className="btn btn-outline btn-lg">
                    <Share2 size={20} />
                    Share Certificate
                </button>
            </div>

            <style jsx>{`
        .certificate-generator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-6);
        }

        .certificate-preview {
          width: 100%;
          max-width: 900px;
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
        }

        .certificate-actions {
          display: flex;
          gap: var(--space-4);
        }
      `}</style>
        </div>
    );
};

export default CertificateGenerator;
