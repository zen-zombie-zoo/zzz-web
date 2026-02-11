export type Entity = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type Bounds = {
  width: number;
  height: number;
  padding: number;
  topPadding: number;
};

// Movement constants
export const ZOMBIE_SPEED = 10;
export const VISITOR_SPEED = 20;
export const TURN_CHANCE_PER_SECOND = 0.5;

/**
 * Creates a random cardinal direction velocity (up, down, left, or right)
 */
export function createCardinalVelocity(speed: number): { vx: number; vy: number } {
  const dir = Math.floor(Math.random() * 4);
  return {
    vx: dir === 0 ? speed : dir === 2 ? -speed : 0,
    vy: dir === 1 ? speed : dir === 3 ? -speed : 0
  };
}

/**
 * Updates a zombie's position with cardinal movement and random turning
 */
export function updateZombieMovement(entity: Entity, bounds: Bounds, entitySize: number, dt: number): void {
  const { width, height, padding, topPadding } = bounds;

  // Update position
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;

  // Random chance to turn left or right
  if (Math.random() < TURN_CHANCE_PER_SECOND * dt) {
    const turnRight = Math.random() < 0.5;
    const { vx, vy } = entity;

    if (vx > 0) {
      // Moving right: turn up or down
      entity.vx = 0;
      entity.vy = turnRight ? ZOMBIE_SPEED : -ZOMBIE_SPEED;
    } else if (vx < 0) {
      // Moving left: turn down or up
      entity.vx = 0;
      entity.vy = turnRight ? -ZOMBIE_SPEED : ZOMBIE_SPEED;
    } else if (vy > 0) {
      // Moving down: turn left or right
      entity.vy = 0;
      entity.vx = turnRight ? -ZOMBIE_SPEED : ZOMBIE_SPEED;
    } else if (vy < 0) {
      // Moving up: turn right or left
      entity.vy = 0;
      entity.vx = turnRight ? ZOMBIE_SPEED : -ZOMBIE_SPEED;
    }
  }

  // Bounce off walls (cardinal direction only)
  if (entity.x < padding) {
    entity.x = padding;
    entity.vx = ZOMBIE_SPEED;
    entity.vy = 0;
  }
  if (entity.x > width - entitySize - padding) {
    entity.x = width - entitySize - padding;
    entity.vx = -ZOMBIE_SPEED;
    entity.vy = 0;
  }
  if (entity.y < topPadding) {
    entity.y = topPadding;
    entity.vy = ZOMBIE_SPEED;
    entity.vx = 0;
  }
  if (entity.y > height - entitySize - padding) {
    entity.y = height - entitySize - padding;
    entity.vy = -ZOMBIE_SPEED;
    entity.vx = 0;
  }
}

/**
 * Updates a visitor's position with free movement (diagonal allowed)
 */
export function updateVisitorMovement(entity: Entity, bounds: Bounds, entitySize: number, dt: number): void {
  const { width, height, padding, topPadding } = bounds;

  // Update position
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;

  // Bounce off walls (reflect velocity)
  if (entity.x < padding) {
    entity.x = padding;
    entity.vx = Math.abs(entity.vx);
  }
  if (entity.x > width - entitySize - padding) {
    entity.x = width - entitySize - padding;
    entity.vx = -Math.abs(entity.vx);
  }
  if (entity.y < topPadding) {
    entity.y = topPadding;
    entity.vy = Math.abs(entity.vy);
  }
  if (entity.y > height - entitySize - padding) {
    entity.y = height - entitySize - padding;
    entity.vy = -Math.abs(entity.vy);
  }
}

/**
 * Updates a visitor's velocity to move toward the gate
 */
export function updateVisitorLeaving(entity: Entity, gateX: number, gateY: number, dt: number): void {
  // Calculate direction to gate center
  const dx = gateX - entity.x;
  const dy = gateY - entity.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 0) {
    // Normalize and apply speed
    entity.vx = (dx / dist) * VISITOR_SPEED;
    entity.vy = (dy / dist) * VISITOR_SPEED;
  }

  // Update position
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
}
