// current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);

let day = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
console.log(year + "-" + month + "-" + day);

/////////
model.find.populate esm e champ

// RETURN ALL
router.get('/all', (req,res)=>{
    Product.find().then((result) => {
    /*
    # COUNT
    total= Product.countDocuments((count)=>count)
    res.status(200).send({NBtotal: total})  
    //
    # LIMIT
    const #count= req.params.count? req.params.count:0 => HERE WE LIMIT THE count OF 
    RETURNED VALUES WITH limit(n) methods
    
    Product.find({isFeatured:true}).limit(+count): we add '+' cause count is string and limit as for numeric.
    //
    #

    #FILTER CATEGORIES LIST
    let filter={}
    if (!req.query.categories){
        filter={category: req.query.categories.split(',')}
    }
    productList= await Product.find(filter).populate('category');


    */
        res.status(200).json({success:true,res:result, exec:result.length})  
    }).catch((err) => {
        res.status(404).send(err)})})


//  ALL RETURN
router.get('/all',async(req,res)=>{
    try {
        data= await Category.find().select('-_id -__v');
        // select what u need special API  faster and performant, as:
        // data= await Category.find().select('name image -_id -__v');  the "-_id" means without _id
        res.status(200).send(data)
    } catch (error) {
        res.status(404).send(error)
    }
})



// UPDATE   
router.put('/:id',async(req,res)=>{
    try {
        id= req.params.id
        resp= await Category.findByIdAndUpdate(id,req.body,{new: true})
        //return new data after update {new: true}
        res.status(200).send(resp)
    } catch (error) {
        res.status(404).send(error)   
    }

})


