import { useShakeDialogStore } from "@/store/shakeDialogStore";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useRef } from "react";

interface ShakeDetectorProps {
  onShake?: () => void;
  threshold?: number; // 加速度变化阈值，默认 3.2
  cooldown?: number; // 冷却时间，单位毫秒，默认 2000
  useGlobalDialog?: boolean; // 是否自动触发全局 dialog，默认 true
}

export default function ShakeDetector({
  onShake,
  threshold = 3.2,
  cooldown = 2000,
  useGlobalDialog = true,
}: ShakeDetectorProps) {
  const setVisible = useShakeDialogStore((s) => s.setVisible);
  const lastAcc = useRef({ x: 0, y: 0, z: 0 });
  const lastShakeTime = useRef(0);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(200);

    const sub = DeviceMotion.addListener((motion) => {
      const acc = motion.accelerationIncludingGravity;
      if (!acc) return;

      const now = Date.now();
      const timeSinceLastShake = now - lastShakeTime.current;

      const dx = acc.x - lastAcc.current.x;
      const dy = acc.y - lastAcc.current.y;
      const dz = acc.z - lastAcc.current.z;

      const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (delta > threshold && timeSinceLastShake > cooldown) {
        lastShakeTime.current = now;

        if (useGlobalDialog) {
          setVisible(true);
        }

        if (onShake) {
          onShake();
        }
      }

      lastAcc.current = acc;
    });

    return () => sub.remove();
  }, [threshold, cooldown, onShake, useGlobalDialog]);

  return null;
}
