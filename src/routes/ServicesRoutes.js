import express from 'express';
import { createService, getAllServices, getServiceById, updateService, deleteService,} from '../controllers/ServicesController.js';

const router = express.Router();


router.post('/createService', createService); // Create a new service
router.get('/getAllServices', getAllServices); // Get all services
router.get('/getServicebyId/:id', getServiceById); // Get a service by ID
router.put('/UpdateServiceById/:id', updateService); // Update a service by ID
router.delete('/deleteServiceById/:id', deleteService); // Delete a service by ID

export default router;
