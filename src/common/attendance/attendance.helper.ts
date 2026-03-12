// src/common/attendance/attendance.helper.ts

export type CheckInStatus = 'EARLY' | 'ONTIME_ARRIVAL' | 'LATE';
export type CheckOutStatus = 'ONTIME_DEPARTURE' | 'LEFT_EARLY' | 'OVERTIME';

export class AttendanceHelper {
  private static TOLERANCE_MINUTES = 15; // toleransi 15 menit untuk ONTIME

  /**
   * Menentukan status check-in
   */
  static determineCheckInStatus(checkInTime: Date, shiftStartTime: string): CheckInStatus {
    const [startHour, startMinute] = shiftStartTime.split(':').map(Number);
    const shiftStart = new Date(checkInTime);
    shiftStart.setHours(startHour, startMinute, 0, 0);

    const toleranceMs = this.TOLERANCE_MINUTES * 60 * 1000;

    if (checkInTime.getTime() < shiftStart.getTime()) {
      return 'EARLY';
    } else if (checkInTime.getTime() <= shiftStart.getTime() + toleranceMs) {
      return 'ONTIME_ARRIVAL';
    } else {
      return 'LATE';
    }
  }

  /**
   * Menentukan status check-out
   */
  static determineCheckOutStatus(checkOutTime: Date, shiftEndTime: string): CheckOutStatus {
    const [endHour, endMinute] = shiftEndTime.split(':').map(Number);
    const shiftEnd = new Date(checkOutTime);
    shiftEnd.setHours(endHour, endMinute, 0, 0);

    const toleranceMs = this.TOLERANCE_MINUTES * 60 * 1000;

    if (checkOutTime.getTime() < shiftEnd.getTime()) {
      return 'LEFT_EARLY';
    } else if (checkOutTime.getTime() <= shiftEnd.getTime() + toleranceMs) {
      return 'ONTIME_DEPARTURE';
    } else {
      return 'OVERTIME';
    }
  }

  /**
   * Menghitung estimasi jam untuk check-in
   * EARLY atau LATE → jam float positif
   * ONTIME → null
   */
  static calculateCheckInHours(checkInTime: Date, shiftStartTime: string): number | null {
    const status = this.determineCheckInStatus(checkInTime, shiftStartTime);
    const [startHour, startMinute] = shiftStartTime.split(':').map(Number);
    const shiftStart = new Date(checkInTime);
    shiftStart.setHours(startHour, startMinute, 0, 0);

    const diffHours = (checkInTime.getTime() - shiftStart.getTime()) / (1000 * 60 * 60);
    if (status === 'ONTIME_ARRIVAL') return null;
    if (status === 'EARLY') return Math.abs(diffHours);
    if (status === 'LATE') return diffHours;
    return null;
  }

  /**
   * Menghitung estimasi jam untuk check-out
   * LEFT_EARLY atau OVERTIME → jam float positif
   * ONTIME → null
   */
  static calculateCheckOutHours(checkOutTime: Date, shiftEndTime: string): number | null {
    const status = this.determineCheckOutStatus(checkOutTime, shiftEndTime);
    const [endHour, endMinute] = shiftEndTime.split(':').map(Number);
    const shiftEnd = new Date(checkOutTime);
    shiftEnd.setHours(endHour, endMinute, 0, 0);

    const diffHours = (checkOutTime.getTime() - shiftEnd.getTime()) / (1000 * 60 * 60);
    if (status === 'ONTIME_DEPARTURE') return null;
    if (status === 'LEFT_EARLY') return Math.abs(diffHours);
    if (status === 'OVERTIME') return diffHours;
    return null;
  }

  /**
   * Konversi jam float menjadi format string singkat "Xh Ym"
   * Jika jam null → return null
   */
  static hoursToString(hoursFloat: number | null): string | null {
    if (hoursFloat === null) return null;
    const totalMinutes = Math.round(hoursFloat * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h ${mins}m`;
  }

  /**
   * Ambil estimasi check-in: mengembalikan float dan string singkat
   * Jika ONTIME → null
   */
  static getCheckInDuration(checkInTime: Date, shiftStartTime: string) {
    const hours = this.calculateCheckInHours(checkInTime, shiftStartTime);
    return {
      hours,
      formatted: this.hoursToString(hours),
    };
  }

  /**
   * Ambil estimasi check-out: mengembalikan float dan string singkat
   * Jika ONTIME → null
   */
  static getCheckOutDuration(checkOutTime: Date, shiftEndTime: string) {
    const hours = this.calculateCheckOutHours(checkOutTime, shiftEndTime);
    return {
      hours,
      formatted: this.hoursToString(hours),
    };
  }
}
