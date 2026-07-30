import React, { useRef, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { formatEstimatedWait } from "../utils/formatTime";

interface QueuePositionCardProps {
  position: number | null;
  avgServiceTimeMins: number;
  queueName: string;
}

const SIZE = Math.min(Dimensions.get("window").width - 64, 280);

const colorForPosition = (position: number | null): THREE.Color => {
  if (position === null) return new THREE.Color("#818CF8");
  const t = Math.max(0, Math.min(1, 1 - (position - 1) / 8));
  const from = new THREE.Color("#4F46E5");
  const to = new THREE.Color("#10B981");
  return from.lerp(to, t);
};

export const QueuePositionCard: React.FC<QueuePositionCardProps> = ({
  position,
  avgServiceTimeMins,
  queueName,
}) => {
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.15, { damping: 6 }),
      withSpring(1, { damping: 8 }),
    );
  }, [position, scale]);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color = colorForPosition(position);
      material.emissive = colorForPosition(position);
      material.emissiveIntensity = 0.25;
    }
  }, [position]);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(SIZE, SIZE);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const point = new THREE.PointLight(0xffffff, 1.2);
    point.position.set(3, 3, 4);
    scene.add(ambient, point);

    const geometry = new THREE.TorusKnotGeometry(0.9, 0.28, 150, 20);
    const material = new THREE.MeshStandardMaterial({
      color: colorForPosition(position),
      emissive: colorForPosition(position),
      emissiveIntensity: 0.25,
      metalness: 0.35,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      mesh.rotation.x += 0.006;
      mesh.rotation.y += 0.011;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const animatedNumberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center justify-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <GLView
          style={{ width: SIZE, height: SIZE }}
          onContextCreate={onContextCreate}
        />
        <View className="absolute inset-0 items-center justify-center">
          <Animated.Text
            style={animatedNumberStyle}
            className="text-7xl font-bold text-white"
          >
            {position ?? "—"}
          </Animated.Text>
        </View>
      </View>
      <Text className="text-gray-500 dark:text-gray-400 mt-4 text-base">
        {position !== null ? "people ahead of you" : "not currently in queue"}
      </Text>
      {position !== null ? (
        <Text className="text-primary font-semibold mt-1">
          {formatEstimatedWait(position, avgServiceTimeMins)}
        </Text>
      ) : null}
      <Text className="text-gray-400 dark:text-gray-500 text-xs mt-2">
        {queueName}
      </Text>
    </View>
  );
};
