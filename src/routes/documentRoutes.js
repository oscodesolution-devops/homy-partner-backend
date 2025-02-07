import express from 'express';
import { 
    uploadDocument, 
    getDocuments, 
    getDocumentById, 
    updateDocument, 
    deleteDocument 
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/uploadDocument', uploadDocument);
router.get('/getAlldocument', getDocuments);
router.get('/getDocumentByUserId/:id', getDocumentById);
router.put('/UpdateDocumentByUserId/:id', updateDocument);
router.delete('/deleteDocumentByUserId/:id', deleteDocument);

export default router;
