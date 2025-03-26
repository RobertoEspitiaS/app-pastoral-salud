import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Medication } from '../entities/Medication';
import { LessThanOrEqual } from 'typeorm';

const router = Router();

// Get all medications
router.get('/', async (req, res) => {
  try {
    const medicationRepository = getRepository(Medication);
    const medications = await medicationRepository.find();
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications' });
  }
});

// Get expiring medications
router.get('/expiring', async (req, res) => {
  try {
    const medicationRepository = getRepository(Medication);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringMedications = await medicationRepository.find({
      where: {
        expirationDate: LessThanOrEqual(thirtyDaysFromNow),
      },
    });

    res.json(expiringMedications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expiring medications' });
  }
});

// Create new medication
router.post('/', async (req, res) => {
  try {
    const medicationRepository = getRepository(Medication);
    const medication = medicationRepository.create(req.body);
    const result = await medicationRepository.save(medication);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating medication' });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const medicationRepository = getRepository(Medication);
    const medication = await medicationRepository.findOne(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    medicationRepository.merge(medication, req.body);
    const result = await medicationRepository.save(medication);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating medication' });
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const medicationRepository = getRepository(Medication);
    const medication = await medicationRepository.findOne(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    await medicationRepository.remove(medication);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medication' });
  }
});

export default router; 