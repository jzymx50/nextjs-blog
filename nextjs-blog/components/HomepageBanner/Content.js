import { motion } from "framer-motion"

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        };
    }
};

export default function Content(props) {
    const { title, content, direction } = props

    return (
        <div className='mw9 center cf'>
            <motion.div
                key={title}
                custom={direction}
                initial='enter'
                animate='center'
                exit='exit'
                variants={variants}
                transition={{ x: { type: 'spring', damping: 100, stiffness: 3000 } }}
            >
                <div className='w-third fl'>
                    <img src="https://placeholder.pics/svg/100/DEDEDE/555555/1" width='100%' />
                </div>
                <div className='w-50 fr'>
                    <div className='f1 mv4 b ttc'>{title}</div>
                    <div className='f2'>{content}</div>

                </div>
            </motion.div>
        </div>

    )
}