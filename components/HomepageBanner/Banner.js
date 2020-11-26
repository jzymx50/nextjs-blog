import {
    ChevronRight,
    ChevronLeft,
    CircleFill,
    Circle,
} from "react-bootstrap-icons";
import styles from "./Banner.module.css";
import { useState } from "react";
import Content from "./Content";
import { AnimatePresence } from "framer-motion";
import items from "./text";
import { urlObjectKeys } from "next/dist/next-server/lib/utils";

function Banner() {
    const [direction, setDirection] = useState(0);
    const [index, setIndex] = useState(0);

    const onClick = function (e) {
        switch (e.currentTarget.id) {
            case "left":
                setDirection(-1);
                setIndex(Math.abs((index - 1) % 2));
                break;
            case "right":
                setDirection(1);
                setIndex(Math.abs((index + 1) % 2));
                break;
            default:
                break;
        }
    };

    return (
        <div className="bg-light-gray pt5 relative overflow-hidden z-1">
            <div className="mw8 center">
                <AnimatePresence initial={false} custom={index} exitBeforeEnter>
                    <Content
                        title={items[index].title}
                        content={items[index].content}
                        url={items[index].url}
                        direction={direction}
                    />
                </AnimatePresence>

                <div
                    className="absolute right-2 top-0 h-100 w3 pointer"
                    id="right"
                    onClick={onClick}
                >
                    <ChevronRight size="48" className={styles.mid} />
                </div>

                <div
                    className="absolute left-2 top-0 h-100 w3 pointer"
                    id="left"
                    onClick={onClick}
                >
                    <ChevronLeft size="48" className={styles.mid} />
                </div>

                <div className="tc pb4 mt3">
                    {index === 0 ? (
                        <>
                            <CircleFill size="8" className="mh1" />
                            <Circle size="8" className="mh1" />
                        </>
                    ) : (
                            <>
                                <Circle size="8" className="mh1" />
                                <CircleFill size="8" className="mh1" />
                            </>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Banner;
