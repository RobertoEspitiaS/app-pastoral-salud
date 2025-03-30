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

// Create new consultation
router.post('/', async (req: Request, res: Response) => {
  try {
    const consultationRepository = getRepository(Consultation);
    const prescriptionItemRepository = getRepository(PrescriptionItem);
    const medicationRepository = getRepository(Medication);

    // Create consultation
    const consultation = consultationRepository.create(req.body);
    const result = await consultationRepository.save(consultation);

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
        consultation: result,
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

    const updatedConsultation = await consultationRepository.findOne(result.id, {
      relations: ['prescription', 'prescription.medication'],
    });
    return res.status(201).json(updatedConsultation);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating consultation' });
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