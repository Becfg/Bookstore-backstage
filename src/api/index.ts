import {Router} from 'express'
import staff from "./controller/staff";
import job from "./controller/job";


const router = Router()

// Add interface
router.get('/staff', staff.getStaffList)
router.post('/staff',staff.addStaff)
router.put('/staff',staff.modifyStaffInfo)
router.delete("/staff/:id",staff.deleteStaff)

router.get('/job', job.getJobList)
router.post('/job',job.addJob)
router.delete("/job/:id",job.deleteJob)



export default router