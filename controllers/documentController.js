import Document from '../models/Documents.js';
import User from '../models/UsersModel.js'

// Create a new document
const uploadDocument = async (req, res) => {
  try {
    const { user_id, document_type, document_number, images, status } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newDocument = new Document({
      user_id,
      document_type,
      document_number,
      images,
      status: status || 'pending'
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating document', error: error.message });
  }
};


// Get all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('user_id', 'name email');
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

// Get a document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('user_id', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
};

// Update a document
const updateDocument = async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);

    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};

export { uploadDocument, getDocuments, getDocumentById, updateDocument, deleteDocument };