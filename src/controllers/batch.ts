import { Router } from 'express';
import { Batch } from '../models/batch';
import BatchService from '../services/batch';
import { JwtUtils } from '../utils/jwt';


const router = Router();

router.get('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const batch = await BatchService.findByBatchRegNo(batchRegNo);
    res.json(batch);
});

router.put('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const accountId = JwtUtils.getAccountId(req);
    const batch: Batch = req.body;
    if (!batch.certificates) {
        batch.regNo = batchRegNo;
        await BatchService.create(batch, accountId);
        res.sendStatus(201);
    }
    else {
        await BatchService.confirm(batchRegNo, accountId, true);
        res.sendStatus(200);
    }
});

router.delete('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const accountId = JwtUtils.getAccountId(req);
    await BatchService.confirm(batchRegNo, accountId, false);
    res.sendStatus(200);
});

export default router;