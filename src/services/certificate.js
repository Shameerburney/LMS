import dbService from './db';

const certificateService = {
    // Issue a certificate
    async issueCertificate(data) {
        const certificate = {
            ...data,
            id: `cert-${Date.now()}`,
            issuedAt: Date.now(),
            certificateNumber: `CERT-${Date.now().toString(36).toUpperCase()}`,
        };
        return await dbService.add('certificates', certificate);
    },

    // Get user certificates
    async getUserCertificates(userId) {
        return await dbService.getAllByIndex('certificates', 'userId', userId);
    },

    // Get certificate by ID
    async getCertificate(id) {
        return await dbService.get('certificates', id);
    },

    // Verify certificate
    async verifyCertificate(certNumber) {
        const allCerts = await dbService.getAll('certificates');
        return allCerts.find(c => c.certificateNumber === certNumber);
    }
};

export default certificateService;
