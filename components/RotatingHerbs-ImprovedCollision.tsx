// This is a patch for the triangle collision detection
// Add this improved collision handling to RotatingHerbs.tsx

// Improved triangle collision detection
const improvedTriangleCollision = (herb: any, obstacle: any) => {
  const { apex, leftBase, rightBase } = obstacle;
  
  // Helper function to check if point is inside triangle
  const isPointInTriangle = (px: number, py: number) => {
    // Using barycentric coordinates for robust detection
    const v0x = rightBase.x - leftBase.x;
    const v0y = rightBase.y - leftBase.y;
    const v1x = apex.x - leftBase.x;
    const v1y = apex.y - leftBase.y;
    const v2x = px - leftBase.x;
    const v2y = py - leftBase.y;
    
    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;
    
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    return (u >= 0) && (v >= 0) && (u + v <= 1);
  };
  
  // Check if herb center is inside triangle
  if (isPointInTriangle(herb.x, herb.y)) {
    // Calculate triangle center
    const centerX = (apex.x + leftBase.x + rightBase.x) / 3;
    const centerY = (apex.y + leftBase.y + rightBase.y) / 3;
    
    // Calculate push direction from center to herb
    const dx = herb.x - centerX;
    const dy = herb.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 1) {
      // Herb is at center - give random direction
      const angle = Math.random() * Math.PI * 2;
      herb.vx = Math.cos(angle) * 5;
      herb.vy = Math.sin(angle) * 5;
    } else {
      // Push herb away from center with strong force
      const pushForce = 8;
      herb.vx = (dx / dist) * pushForce;
      herb.vy = (dy / dist) * pushForce;
    }
    
    // Add some randomness to prevent getting stuck in patterns
    herb.vx += (Math.random() - 0.5) * 2;
    herb.vy += (Math.random() - 0.5) * 2;
    
    // Ensure minimum velocity to escape
    const minVelocity = 3;
    const currentVelocity = Math.sqrt(herb.vx * herb.vx + herb.vy * herb.vy);
    if (currentVelocity < minVelocity) {
      const scale = minVelocity / currentVelocity;
      herb.vx *= scale;
      herb.vy *= scale;
    }
    
    // Move herb immediately
    herb.x += herb.vx * 5;
    herb.y += herb.vy * 5;
    
    return true; // Collision detected and handled
  }
  
  return false; // No collision
};

// Export the function for use in RotatingHerbs.tsx
export { improvedTriangleCollision };