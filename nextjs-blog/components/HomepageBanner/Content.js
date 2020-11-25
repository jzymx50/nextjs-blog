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
    const { title, content, direction, url } = props

    return (
        <div className='center cf'>
            <motion.div
                key={title}
                custom={direction}
                initial='enter'
                animate='center'
                exit='exit'
                variants={variants}
                transition={{ x: { type: 'spring', damping: 100, stiffness: 3000 } }}
            >
                <div className='w-two-thirds fl pr5'>
                    <img src={url} width='100%' />
                </div>
                <div className='w-third fr pl3'>
                    <div className='f2 mb4 b ttc'>{title}</div>
                    <div className='f3'>{content}</div>
                </div>
            </motion.div>
        </div>

    )
}