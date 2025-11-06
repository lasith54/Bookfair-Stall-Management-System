// Application constants
const USER_ROLES = {
  VENDOR: 'vendor',
  PUBLISHER: 'publisher',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

const STALL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const STALL_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  UNAVAILABLE: 'unavailable',
};

const MAX_STALLS_PER_BUSINESS = 3;

module.exports = {
  USER_ROLES,
  STALL_SIZES,
  RESERVATION_STATUS,
  STALL_STATUS,
  MAX_STALLS_PER_BUSINESS,
};
