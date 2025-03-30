import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Consultation } from '../entities/Consultation';
import { PrescriptionItem } from '../entities/PrescriptionItem';
import { Medication } from '../entities/Medication';

const router = Router();

// Get all consultations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultations = await consultationRepository.find();
    return res.json(consultations);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching consultations' });
  }
});

// Get consultation by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultation = await consultationRepository.findOne({
      where: { id: Number(req.params.id) }
    });
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    return res.json(consultation);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching consultation' });
  }
});

// Create new consultation
router.post('/', async (req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const prescriptionItemRepository = getRepository(PrescriptionItem);
    const medicationRepository = getRepository(Medication);

    // Create consultation
    const consultation = consultationRepository.create(req.body);
    const savedConsultation = await consultationRepository.save(consultation);

    // Create prescription items and update medication quantities
    if (req.body.prescription && Array.isArray(req.body.prescription)) {
      for (const prescriptionItem of req.body.prescription) {
        // Find medication
        const medication = await medicationRepository.findOne({
          where: { id: prescriptionItem.medicationId }
        });

        if (!medication) {
          return res.status(404).json({ message: `Medication with ID ${prescriptionItem.medicationId} not found` });
        }

        // Create prescription item
        const newPrescriptionItem = prescriptionItemRepository.create({
          consultation: savedConsultation,
          medication: medication,
          dosage: prescriptionItem.dosage,
          instructions: prescriptionItem.instructions
        });

        await prescriptionItemRepository.save(newPrescriptionItem);

        // Update medication quantity
        medication.quantity -= prescriptionItem.dosage;
        await medicationRepository.save(medication);
      }
    }

    // Get the updated consultation with all relations
    const updatedConsultation = await consultationRepository.findOne({
      where: { id: savedConsultation.id },
      relations: ['prescription', 'prescription.medication']
    });

    return res.status(201).json(updatedConsultation);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating consultation' });
  }
});

// Update consultation
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultation = await consultationRepository.findOne({
      where: { id: Number(req.params.id) }
    });
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultationRepository.merge(consultation, req.body);
    const result = await consultationRepository.save(consultation);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating consultation' });
  }
});

// Delete consultation
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const consultation = await consultationRepository.findOne({
      where: { id: Number(req.params.id) }
    });
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    await consultationRepository.remove(consultation);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting consultation' });
  }
});

export default router; 