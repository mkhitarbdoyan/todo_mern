const { Router } = require('express')
const router = Router()
const User = require('../models/Users')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')



router.post('/registration',
    [
        check('email', 'Սխալ էլ․ հասցե').isEmail(),
        check('password', 'գաղտնաբառը շատ պարզ է').isLength({ min: 4 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req, res);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Գրանցման սխալ"
                })

            }


            const { email, password } = req.body

            const isUsed = await User.findOne({ email: email })

            if (isUsed) {
                return res.status(300).json({ message: "Նման օգտատեր գոյություն ունի արդեն․․․" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)


            const user = new User({
                email, password: hashedPassword
            })
            await user.save()
            res.status(201).json({ message: 'Օգտատերը ստեղծված է․․․' })
        } catch (error) {
            console.log(error);
        }
    })

router.post('/login',
    [
        check('email', 'Սխալ էլ․ հասցե').isEmail(),
        check('password', 'մուտքագրել գաղտնաբառը').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req, res);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Գրանցման սխալ"
                })

            }
            const { email, password } = req.body

            const user = await User.findOne({ email})
   
            if(!user){
                return res.send(400).json({ message:"նման օգտատեր գոյություն չունի․․․"})
           
            }
            const isOkPas = bcrypt.compare(password , user.password)
            
            if (!isOkPas){
                return res.send(400).json({ message: "սխալ գաղտնաբառ․․․" })
            }

            const jwtSecret = "lkjghfxd2343435465et5o4k5nt45lkertnegerdfjmvnfmdlnxvdfgyuioausbvdhasjkdjasdjkasjdnmasj"

            const token  = jwt.sign(
                {userId : user.id},
                jwtSecret,
                {expiresIn: "1h"}
                )

            res.json({ token, userId: user.id })




    
        } catch (error) {
            console.log(error);
        }
    })


module.exports = router