import {Router} from 'express'
import staff from "./controller/staff";
import job from "./controller/job";
import category from "./controller/category";
import vendor from "./controller/vendor";
import sale from "./controller/sale";
import purchase from "./controller/purchase";
import book from "./controller/book";
import dailyCounting from "./controller/dailyCounting";
import monthlyCounting from "./controller/monthlyCounting";
import login from "./controller/login";


const router = Router()

// Add interface
router.get('/staff', staff.getStaffList)
router.post('/staff', staff.addStaff)
router.put('/staff', staff.modifyStaffInfo)
router.delete("/staff/:id", staff.deleteStaff)

router.get('/book', book.getBookList)
router.post('/book', book.addBook)
router.put('/book', book.modifyBookInfo)
router.delete("/book/:id", book.deleteBook)

router.get('/vendor', vendor.getVendorList)
router.post('/vendor', vendor.addVendor)
router.put('/vendor', vendor.modifyVendorInfo)
router.delete("/vendor/:id", vendor.deleteVendor)

router.get('/job', job.getJobList)
router.post('/job', job.addJob)
router.delete("/job/:id", job.deleteJob)

router.get('/category', category.getCategoryList)
router.post('/category', category.addCategory)
router.delete("/category/:id", category.deleteCategory)

router.get('/sale', sale.getSaleList)
router.get('/saleDetail/:saleId', sale.getSalesDetail)
router.post('/sale', sale.addSale)
router.put('/sale', sale.modifySaleInfo)
router.delete("/sale/:id", sale.deleteSale)
router.delete("/salesDetail", sale.deleteSalesDetail)

router.get('/purchase', purchase.getPurchaseList)
router.get('/purchaseDetails/:purchaseId', purchase.getPurchaseDetails)
router.post('/purchase', purchase.addPurchase)
router.put('/purchase', purchase.modifyPurchaseInfo)
router.delete("/purchase/:id", purchase.deletePurchase)
router.delete("/purchaseDetails", purchase.deletePurchaseDetails)

router.get('/dailyCounting', dailyCounting.getDailyCountingList)
router.post('/dailyCounting', dailyCounting.addDailyCounting)
router.put('/dailyCounting', dailyCounting.modifyDailyCountingInfo)
router.delete("/dailyCounting/:id", dailyCounting.deleteDailyCounting)

router.get('/monthlyCounting', monthlyCounting.getMonthlyCountingList)
router.post('/monthlyCounting', monthlyCounting.addMonthlyCounting)
router.put('/monthlyCounting', monthlyCounting.modifyMonthlyCountingInfo)
router.delete("/monthlyCounting/:id", monthlyCounting.deleteMonthlyCounting)

router.post('/login',login)
export default router