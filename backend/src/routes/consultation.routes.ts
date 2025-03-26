import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Consultation } from '../entities/Consultation';
import { PrescriptionItem } from '../entities/PrescriptionItem';
import { Medication } from '../entities/Medication';

const router = Router();

// Get all consultations
router.get('/', async (req, res) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultations = await consultationRepository.find({
      relations: ['prescription', 'prescription.medication'],
    });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations' });
  }
});

// Create new consultation
router.post('/', async (req, res) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const prescriptionItemRepository = getRepository(PrescriptionItem);
    const medicationRepository = getRepository(Medication);

    // Create consultation
    const consultation = consultationRepository.create({
      patientName: req.body.patientName,
      date: req.body.date,
      diagnosis: req.body.diagnosis,
    });
    const savedConsultation = await consultationRepository.save(consultation);

    // Create prescription items and update medication quantities
    for (const prescriptionItem of req.body.prescription) {
      const medication = await medicationRepository.findOne(prescriptionItem.medicationId);
      if (!medication) {
        return res.status(404).json({
          message: `Medication with ID ${prescriptionItem.medicationId} not found`,
        });
      }

      if (medication.quantity < prescriptionItem.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for medication ${medication.name}`,
        });
      }

      // Create prescription item
      const newPrescriptionItem = prescriptionItemRepository.create({
        consultation: savedConsultation,
        medication: medication,
        dosage: prescriptionItem.dosage,
        quantity: prescriptionItem.quantity,
        instructions: prescriptionItem.instructions,
      });
      await prescriptionItemRepository.save(newPrescriptionItem);

      // Update medication quantity
      medication.quantity -= prescriptionItem.quantity;
      await medicationRepository.save(medication);
    }

    const result = await consultationRepository.findOne(savedConsultation.id, {
      relations: ['prescription', 'prescription.medication'],
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating consultation' });
  }
});

// Get consultation by ID
router.get('/:id', async (req, res) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultation = await consultationRepository.findOne(req.params.id, {
      relations: ['prescription', 'prescription.medication'],
    });
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultation' });
  }
});

// Delete consultation
router.delete('/:id', async (req, res) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultation = await consultationRepository.findOne(req.params.id, {
      relations: ['prescription'],
    });
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    await consultationRepository.remove(consultation);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation' });
  }
});

export default router; 