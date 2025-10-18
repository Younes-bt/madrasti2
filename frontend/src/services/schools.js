/**
 * Schools API Service
 * Handles school management, academic structure, classes, subjects, and rooms
 */

import { apiMethods } from './api.js';

/**
 * Schools Service Class
 */
class SchoolsService {
  // ==================== SCHOOL CONFIGURATION ====================

  /**
   * Get School Configuration
   * @returns {Promise<Object>} School configuration data
   */
  async getSchoolConfig() {
    try {
      const response = await apiMethods.get('schools/config/');
      return response;
    } catch (error) {
      console.error('Get school config failed:', error);
      throw error;
    }
  }

  /**
   * Update School Configuration
   * @param {Object} configData - School configuration data
   * @returns {Promise<Object>} Updated configuration
   */
  async updateSchoolConfig(configData) {
    try {
      const response = await apiMethods.put('schools/config/', configData);
      return response;
    } catch (error) {
      console.error('Update school config failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update School Configuration
   * @param {Object} configData - Partial school configuration data
   * @returns {Promise<Object>} Updated configuration
   */
  async patchSchoolConfig(configData) {
    try {
      const response = await apiMethods.patch('schools/config/', configData);
      return response;
    } catch (error) {
      console.error('Patch school config failed:', error);
      throw error;
    }
  }

  // ==================== ACADEMIC YEARS ====================

  /**
   * Get Academic Years
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Academic years list
   */
  async getAcademicYears(params = {}) {
    try {
      const response = await apiMethods.get('schools/academic-years/', { params });
      return response;
    } catch (error) {
      console.error('Get academic years failed:', error);
      throw error;
    }
  }

  /**
   * Get Current Academic Year
   * @returns {Promise<Object>} Current academic year
   */
  async getCurrentAcademicYear() {
    try {
      const response = await apiMethods.get('schools/academic-years/', {
        params: { is_current: true }
      });
      return response.results?.[0] || null;
    } catch (error) {
      console.error('Get current academic year failed:', error);
      throw error;
    }
  }

  /**
   * Create Academic Year
   * @param {Object} yearData - Academic year data
   * @returns {Promise<Object>} Created academic year
   */
  async createAcademicYear(yearData) {
    try {
      const response = await apiMethods.post('schools/academic-years/', yearData);
      return response;
    } catch (error) {
      console.error('Create academic year failed:', error);
      throw error;
    }
  }

  /**
   * Update Academic Year
   * @param {number} yearId - Academic year ID
   * @param {Object} yearData - Academic year data
   * @returns {Promise<Object>} Updated academic year
   */
  async updateAcademicYear(yearId, yearData) {
    try {
      const response = await apiMethods.put(`schools/academic-years/${yearId}/`, yearData);
      return response;
    } catch (error) {
      console.error('Update academic year failed:', error);
      throw error;
    }
  }

  // ==================== EDUCATIONAL LEVELS ====================

  /**
   * Get Educational Levels
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Educational levels list
   */
  async getEducationalLevels(params = {}) {
    try {
      const response = await apiMethods.get('schools/levels/', { params });
      return response;
    } catch (error) {
      console.error('Get educational levels failed:', error);
      throw error;
    }
  }

  /**
   * Get Educational Level by ID
   * @param {number} levelId - Educational level ID
   * @returns {Promise<Object>} Educational level data
   */
  async getEducationalLevelById(levelId) {
    try {
      const response = await apiMethods.get(`schools/levels/${levelId}/`);
      return response;
    } catch (error) {
      console.error('Get educational level failed:', error);
      throw error;
    }
  }

  /**
   * Create Educational Level
   * @param {Object} levelData - Educational level data
   * @returns {Promise<Object>} Created educational level
   */
  async createEducationalLevel(levelData) {
    try {
      const response = await apiMethods.post('schools/levels/', levelData);
      return response;
    } catch (error) {
      console.error('Create educational level failed:', error);
      throw error;
    }
  }

  /**
   * Update Educational Level
   * @param {number} levelId - Educational level ID
   * @param {Object} levelData - Educational level data
   * @returns {Promise<Object>} Updated educational level
   */
  async updateEducationalLevel(levelId, levelData) {
    try {
      const response = await apiMethods.put(`schools/levels/${levelId}/`, levelData);
      return response;
    } catch (error) {
      console.error('Update educational level failed:', error);
      throw error;
    }
  }

  /**
   * Delete Educational Level
   * @param {number} levelId - Educational level ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteEducationalLevel(levelId) {
    try {
      const response = await apiMethods.delete(`schools/levels/${levelId}/`);
      return response;
    } catch (error) {
      console.error('Delete educational level failed:', error);
      throw error;
    }
  }

  // ==================== GRADES ====================

  /**
   * Get Grades
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Grades list
   */
  async getGrades(params = {}) {
    try {
      const response = await apiMethods.get('schools/grades/', { params });
      return response;
    } catch (error) {
      console.error('Get grades failed:', error);
      throw error;
    }
  }

  /**
   * Get Grade by ID
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Object>} Grade data
   */
  async getGradeById(gradeId) {
    try {
      const response = await apiMethods.get(`schools/grades/${gradeId}/`);
      return response;
    } catch (error) {
      console.error('Get grade failed:', error);
      throw error;
    }
  }

  /**
   * Create Grade
   * @param {Object} gradeData - Grade data
   * @returns {Promise<Object>} Created grade
   */
  async createGrade(gradeData) {
    try {
      const response = await apiMethods.post('schools/grades/', gradeData);
      return response;
    } catch (error) {
      console.error('Create grade failed:', error);
      throw error;
    }
  }

  /**
   * Update Grade
   * @param {number} gradeId - Grade ID
   * @param {Object} gradeData - Grade data
   * @returns {Promise<Object>} Updated grade
   */
  async updateGrade(gradeId, gradeData) {
    try {
      const response = await apiMethods.put(`schools/grades/${gradeId}/`, gradeData);
      return response;
    } catch (error) {
      console.error('Update grade failed:', error);
      throw error;
    }
  }

  /**
   * Delete Grade
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteGrade(gradeId) {
    try {
      const response = await apiMethods.delete(`schools/grades/${gradeId}/`);
      return response;
    } catch (error) {
      console.error('Delete grade failed:', error);
      throw error;
    }
  }

  // ==================== TRACKS ====================

  /**
   * Get Tracks
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tracks list
   */
  async getTracks(params = {}) {
    try {
      const response = await apiMethods.get('schools/tracks/', { params });
      return response;
    } catch (error) {
      console.error('Get tracks failed:', error);
      throw error;
    }
  }

  /**
   * Get Track by ID
   * @param {number} trackId - Track ID
   * @returns {Promise<Object>} Track data
   */
  async getTrackById(trackId) {
    try {
      const response = await apiMethods.get(`schools/tracks/${trackId}/`);
      return response;
    } catch (error) {
      console.error('Get track failed:', error);
      throw error;
    }
  }

  /**
   * Get Tracks for a Grade
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Object>} Tracks for grade
   */
  async getTracksForGrade(gradeId) {
    try {
      const response = await apiMethods.get('schools/tracks/', { params: { grade: gradeId } });
      return response;
    } catch (error) {
      console.error('Get tracks for grade failed:', error);
      throw error;
    }
  }

  // ==================== CLASSES ====================

  /**
   * Get Classes
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Classes list
   */
  async getClasses(params = {}) {
    try {
      const response = await apiMethods.get('schools/classes/', { params });
      return response;
    } catch (error) {
      console.error('Get classes failed:', error);
      throw error;
    }
  }

  /**
   * Get Class by ID
   * @param {number} classId - Class ID
   * @returns {Promise<Object>} Class data
   */
  async getClassById(classId) {
    try {
      const response = await apiMethods.get(`schools/classes/${classId}/`);
      return response;
    } catch (error) {
      console.error('Get class failed:', error);
      throw error;
    }
  }

  /**
   * Create Class
   * @param {Object} classData - Class data
   * @returns {Promise<Object>} Created class
   */
  async createClass(classData) {
    try {
      const response = await apiMethods.post('schools/classes/', classData);
      return response;
    } catch (error) {
      console.error('Create class failed:', error);
      throw error;
    }
  }

  /**
   * Update Class
   * @param {number} classId - Class ID
   * @param {Object} classData - Class data
   * @returns {Promise<Object>} Updated class
   */
  async updateClass(classId, classData) {
    try {
      const response = await apiMethods.put(`schools/classes/${classId}/`, classData);
      return response;
    } catch (error) {
      console.error('Update class failed:', error);
      throw error;
    }
  }

  /**
   * Delete Class
   * @param {number} classId - Class ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteClass(classId) {
    try {
      const response = await apiMethods.delete(`schools/classes/${classId}/`);
      return response;
    } catch (error) {
      console.error('Delete class failed:', error);
      throw error;
    }
  }

  /**
   * Get Class Students
   * @param {number} classId - Class ID
   * @returns {Promise<Object>} Class students list
   */
  async getClassStudents(classId) {
    try {
      const response = await apiMethods.get(`schools/classes/${classId}/students/`);
      return response;
    } catch (error) {
      console.error('Get class students failed:', error);
      throw error;
    }
  }

  /**
   * Enroll Student in Class
   * @param {number} classId - Class ID
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Enrollment response
   */
  async enrollStudent(classId, enrollmentData) {
    try {
      const response = await apiMethods.post(`schools/classes/${classId}/enroll/`, enrollmentData);
      return response;
    } catch (error) {
      console.error('Enroll student failed:', error);
      throw error;
    }
  }

  /**
   * Unenroll Student from Class
   * @param {number} classId - Class ID
   * @param {Object} unenrollmentData - Unenrollment data
   * @returns {Promise<Object>} Unenrollment response
   */
  async unenrollStudent(classId, unenrollmentData) {
    try {
      const response = await apiMethods.delete(`schools/classes/${classId}/unenroll/`, {
        data: unenrollmentData
      });
      return response;
    } catch (error) {
      console.error('Unenroll student failed:', error);
      throw error;
    }
  }

  // ==================== SUBJECTS ====================

  /**
   * Get Subjects
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Subjects list
   */
  async getSubjects(params = {}) {
    try {
      const response = await apiMethods.get('schools/subjects/', { params });
      return response;
    } catch (error) {
      console.error('Get subjects failed:', error);
      throw error;
    }
  }

  /**
   * Get Subject by ID
   * @param {number} subjectId - Subject ID
   * @returns {Promise<Object>} Subject data
   */
  async getSubjectById(subjectId) {
    try {
      const response = await apiMethods.get(`schools/subjects/${subjectId}/`);
      return response;
    } catch (error) {
      console.error('Get subject failed:', error);
      throw error;
    }
  }

  /**
   * Create Subject
   * @param {Object} subjectData - Subject data
   * @returns {Promise<Object>} Created subject
   */
  async createSubject(subjectData) {
    try {
      const response = await apiMethods.post('schools/subjects/', subjectData);
      return response;
    } catch (error) {
      console.error('Create subject failed:', error);
      throw error;
    }
  }

  /**
   * Update Subject
   * @param {number} subjectId - Subject ID
   * @param {Object} subjectData - Subject data
   * @returns {Promise<Object>} Updated subject
   */
  async updateSubject(subjectId, subjectData) {
    try {
      const response = await apiMethods.put(`schools/subjects/${subjectId}/`, subjectData);
      return response;
    } catch (error) {
      console.error('Update subject failed:', error);
      throw error;
    }
  }

  /**
   * Delete Subject
   * @param {number} subjectId - Subject ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteSubject(subjectId) {
    try {
      const response = await apiMethods.delete(`schools/subjects/${subjectId}/`);
      return response;
    } catch (error) {
      console.error('Delete subject failed:', error);
      throw error;
    }
  }

  // ==================== ROOMS ====================

  /**
   * Get Rooms
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Rooms list
   */
  async getRooms(params = {}) {
    try {
      const response = await apiMethods.get('schools/rooms/', { params });
      return response;
    } catch (error) {
      console.error('Get rooms failed:', error);
      throw error;
    }
  }

  /**
   * Get Room by ID
   * @param {number} roomId - Room ID
   * @returns {Promise<Object>} Room data
   */
  async getRoomById(roomId) {
    try {
      const response = await apiMethods.get(`schools/rooms/${roomId}/`);
      return response;
    } catch (error) {
      console.error('Get room failed:', error);
      throw error;
    }
  }

  /**
   * Create Room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Created room
   */
  async createRoom(roomData) {
    try {
      const response = await apiMethods.post('schools/rooms/', roomData);
      return response;
    } catch (error) {
      console.error('Create room failed:', error);
      throw error;
    }
  }

  /**
   * Update Room
   * @param {number} roomId - Room ID
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Updated room
   */
  async updateRoom(roomId, roomData) {
    try {
      const response = await apiMethods.put(`schools/rooms/${roomId}/`, roomData);
      return response;
    } catch (error) {
      console.error('Update room failed:', error);
      throw error;
    }
  }

  /**
   * Delete Room
   * @param {number} roomId - Room ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteRoom(roomId) {
    try {
      const response = await apiMethods.delete(`schools/rooms/${roomId}/`);
      return response;
    } catch (error) {
      console.error('Delete room failed:', error);
      throw error;
    }
  }

  // ==================== EQUIPMENT ====================

  /**
   * Get Equipment items
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Equipment list
   */
  async getEquipment(params = {}) {
    try {
      const response = await apiMethods.get('schools/equipment/', { params });
      return response.results || response;
    } catch (error) {
      console.error('Get equipment failed:', error);
      throw error;
    }
  }

  /**
   * Get Equipment item by ID
   * @param {number} equipmentId - Equipment ID
   * @returns {Promise<Object>} Equipment data
   */
  async getEquipmentById(equipmentId) {
    try {
      const response = await apiMethods.get(`schools/equipment/${equipmentId}/`);
      return response;
    } catch (error) {
      console.error('Get equipment item failed:', error);
      throw error;
    }
  }

  /**
   * Create Equipment item
   * @param {Object} equipmentData - Equipment payload
   * @returns {Promise<Object>} Created equipment
   */
  async createEquipment(equipmentData) {
    try {
      const response = await apiMethods.post('schools/equipment/', equipmentData);
      return response;
    } catch (error) {
      console.error('Create equipment failed:', error);
      throw error;
    }
  }

  /**
   * Update Equipment item
   * @param {number} equipmentId - Equipment ID
   * @param {Object} equipmentData - Equipment payload
   * @returns {Promise<Object>} Updated equipment
   */
  async updateEquipment(equipmentId, equipmentData) {
    try {
      const response = await apiMethods.put(`schools/equipment/${equipmentId}/`, equipmentData);
      return response;
    } catch (error) {
      console.error('Update equipment failed:', error);
      throw error;
    }
  }

  /**
   * Delete Equipment item
   * @param {number} equipmentId - Equipment ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteEquipment(equipmentId) {
    try {
      const response = await apiMethods.delete(`schools/equipment/${equipmentId}/`);
      return response;
    } catch (error) {
      console.error('Delete equipment failed:', error);
      throw error;
    }
  }

  // ==================== VEHICLES ====================

  /**
   * Get Vehicles
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Vehicles list
   */
  async getVehicles(params = {}) {
    try {
      const response = await apiMethods.get('schools/vehicles/', { params });
      return response.results || response;
    } catch (error) {
      console.error('Get vehicles failed:', error);
      throw error;
    }
  }

  /**
   * Get Vehicle by ID
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<Object>} Vehicle data
   */
  async getVehicle(vehicleId) {
    try {
      const response = await apiMethods.get(`schools/vehicles/${vehicleId}/`);
      return response;
    } catch (error) {
      console.error('Get vehicle failed:', error);
      throw error;
    }
  }

  /**
   * Create Vehicle
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise<Object>} Created vehicle
   */
  async createVehicle(vehicleData) {
    try {
      const response = await apiMethods.post('schools/vehicles/', vehicleData);
      return response;
    } catch (error) {
      console.error('Create vehicle failed:', error);
      throw error;
    }
  }

  /**
   * Update Vehicle
   * @param {number} vehicleId - Vehicle ID
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise<Object>} Updated vehicle
   */
  async updateVehicle(vehicleId, vehicleData) {
    try {
      const response = await apiMethods.put(`schools/vehicles/${vehicleId}/`, vehicleData);
      return response;
    } catch (error) {
      console.error('Update vehicle failed:', error);
      throw error;
    }
  }

  /**
   * Delete Vehicle
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteVehicle(vehicleId) {
    try {
      const response = await apiMethods.delete(`schools/vehicles/${vehicleId}/`);
      return response;
    } catch (error) {
      console.error('Delete vehicle failed:', error);
      throw error;
    }
  }

  /**
   * Get maintenance records for a vehicle
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<Array>} Maintenance records
   */
  async getVehicleMaintenanceRecords(vehicleId) {
    try {
      const response = await apiMethods.get(`schools/vehicles/${vehicleId}/maintenance-records/`);
      return response.results || response;
    } catch (error) {
      console.error('Get vehicle maintenance records failed:', error);
      throw error;
    }
  }

  /**
   * Get a single maintenance record for a vehicle
   * @param {number} vehicleId - Vehicle ID
   * @param {number} recordId - Maintenance record ID
   * @returns {Promise<Object>} Maintenance record data
   */
  async getVehicleMaintenanceRecord(vehicleId, recordId) {
    try {
      const response = await apiMethods.get(
        `schools/vehicles/${vehicleId}/maintenance-records/${recordId}/`
      );
      return response;
    } catch (error) {
      console.error('Get vehicle maintenance record failed:', error);
      throw error;
    }
  }

  /**
   * Create maintenance record for a vehicle
   * @param {number} vehicleId - Vehicle ID
   * @param {Object} recordData - Maintenance record data
   * @returns {Promise<Object>} Created record
   */
  async createVehicleMaintenanceRecord(vehicleId, recordData) {
    try {
      const response = await apiMethods.post(
        `schools/vehicles/${vehicleId}/maintenance-records/`,
        recordData
      );
      return response;
    } catch (error) {
      console.error('Create vehicle maintenance record failed:', error);
      throw error;
    }
  }

  /**
   * Get gasoil records for a vehicle
   * @param {number} vehicleId
   * @returns {Promise<Array>}
   */
  async getVehicleGasoilRecords(vehicleId) {
    try {
      const response = await apiMethods.get(`schools/vehicles/${vehicleId}/gasoil-records/`);
      return response.results || response;
    } catch (error) {
      console.error('Get vehicle gasoil records failed:', error);
      throw error;
    }
  }

  /**
   * Get a single gasoil record for a vehicle
   */
  async getVehicleGasoilRecord(vehicleId, recordId) {
    try {
      const response = await apiMethods.get(
        `schools/vehicles/${vehicleId}/gasoil-records/${recordId}/`
      );
      return response;
    } catch (error) {
      console.error('Get vehicle gasoil record failed:', error);
      throw error;
    }
  }

  /**
   * Create gasoil record
   */
  async createVehicleGasoilRecord(vehicleId, recordData) {
    try {
      const response = await apiMethods.post(
        `schools/vehicles/${vehicleId}/gasoil-records/`,
        recordData
      );
      return response;
    } catch (error) {
      console.error('Create vehicle gasoil record failed:', error);
      throw error;
    }
  }

  /**
   * Update maintenance record for a vehicle
   * @param {number} vehicleId - Vehicle ID
   * @param {number} recordId - Maintenance record ID
   * @param {Object} recordData - Maintenance record data
   * @returns {Promise<Object>} Updated record
   */
  async updateVehicleMaintenanceRecord(vehicleId, recordId, recordData) {
    try {
      const response = await apiMethods.put(
        `schools/vehicles/${vehicleId}/maintenance-records/${recordId}/`,
        recordData
      );
      return response;
    } catch (error) {
      console.error('Update vehicle maintenance record failed:', error);
      throw error;
    }
  }

  /**
   * Delete maintenance record for a vehicle
   * @param {number} vehicleId - Vehicle ID
   * @param {number} recordId - Maintenance record ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteVehicleMaintenanceRecord(vehicleId, recordId) {
    try {
      const response = await apiMethods.delete(
        `schools/vehicles/${vehicleId}/maintenance-records/${recordId}/`
      );
      return response;
    } catch (error) {
      console.error('Delete vehicle maintenance record failed:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get Available Grades for a Subject
   * @param {number} subjectId - Subject ID
   * @returns {Promise<Object>} Available grades
   */
  async getGradesForSubject(subjectId) {
    try {
      const response = await apiMethods.get(`schools/subjects/${subjectId}/grades/`);
      return response;
    } catch (error) {
      console.error('Get grades for subject failed:', error);
      throw error;
    }
  }

  /**
   * Get Available Subjects for a Grade
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Object>} Available subjects
   */
  async getSubjectsForGrade(gradeId) {
    try {
      const response = await apiMethods.get(`schools/grades/${gradeId}/subjects/`);
      return response;
    } catch (error) {
      console.error('Get subjects for grade failed:', error);
      throw error;
    }
  }

  /**
   * Get School Structure Overview
   * @returns {Promise<Object>} Complete school structure
   */
  async getSchoolStructure() {
    try {
      const [levels, grades, classes, subjects, rooms] = await Promise.all([
        this.getEducationalLevels({ detailed: true }),
        this.getGrades(),
        this.getClasses(),
        this.getSubjects(),
        this.getRooms()
      ]);

      return {
        educational_levels: levels.results || levels,
        grades: grades.results || grades,
        classes: classes.results || classes,
        subjects: subjects.results || subjects,
        rooms: rooms.results || rooms
      };
    } catch (error) {
      console.error('Get school structure failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const schoolsService = new SchoolsService();

export default schoolsService;
