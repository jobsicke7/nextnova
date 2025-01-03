"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "../styles/RealTimeSpaceInfo.module.css";

const RealTimeSpaceInfo = () => {
    const [currentText, setCurrentText] = useState("실시간 우주정보");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopIndex, setLoopIndex] = useState(0);

    const textList = ["실시간 우주정보", "모든 천체정보", "인공위성 위치"];

    useEffect(() => {
        const handleTypingEffect = () => {
            const currentString = textList[loopIndex];
            const nextText = isDeleting
                ? currentString.slice(0, currentText.length - 1)
                : currentString.slice(0, currentText.length + 1);

            setCurrentText(nextText);

            if (!isDeleting && nextText === currentString) {
                setTimeout(() => setIsDeleting(true), 1000);
            } else if (isDeleting && nextText === "") {
                setIsDeleting(false);
                setLoopIndex((prevIndex) => (prevIndex + 1) % textList.length);
            }
        };

        const typingTimer = setTimeout(handleTypingEffect, isDeleting ? 50 : 100);
        return () => clearTimeout(typingTimer);
    }, [currentText, isDeleting, loopIndex, textList]);

    return (
        <div className={styles.container}>
            <motion.h1
                className={styles.mainText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {currentText}는
            </motion.h1>
            <span className={styles.highlight}>NEXTNOVA</span>
        </div>
    );
};

export default RealTimeSpaceInfo;

