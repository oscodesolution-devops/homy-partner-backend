import Service from '../models/ServicesModel.js';

// Create a new service
const createService = async (req, res) => {
  try {
    const { user_Id, service_name, category, is_homemaker_service } = req.body;

    const newService = new Service({
      user_Id,
      service_name,
      category,
      is_homemaker_service,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('user_Id', 'name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get a service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('user_Id', 'name email');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const { service_name, category, is_homemaker_service } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { service_name, category, is_homemaker_service },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

export { createService, getAllServices, getServiceById, updateService, deleteService };