package org.kine.backend.modules.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.therapist.Therapist;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Session entity operations.
 * Provides CRUD operations and custom queries for Session management.
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    /**
     * Find sessions by patient.
     * 
     * @param patient the patient to filter by
     * @return list of sessions for the specified patient
     */
    List<Session> findByPatient(Patient patient);

    /**
     * Find sessions by therapist.
     * 
     * @param therapist the therapist to filter by
     * @return list of sessions for the specified therapist
     */
    List<Session> findByTherapist(Therapist therapist);

    /**
     * Find sessions by date.
     * 
     * @param date the date to search for
     * @return list of sessions on the specified date
     */
    List<Session> findByDate(Date date);

    /**
     * Find sessions between two dates.
     * 
     * @param startDate the start date
     * @param endDate the end date
     * @return list of sessions in the specified date range
     */
    List<Session> findByDateBetween(Date startDate, Date endDate);

    /**
     * Find sessions by patient and date range.
     * 
     * @param patient the patient
     * @param startDate the start date
     * @param endDate the end date
     * @return list of sessions for the patient in the date range
     */
    List<Session> findByPatientAndDateBetween(Patient patient, Date startDate, Date endDate);

    /**
     * Find sessions by therapist and date range.
     * 
     * @param therapist the therapist
     * @param startDate the start date
     * @param endDate the end date
     * @return list of sessions for the therapist in the date range
     */
    List<Session> findByTherapistAndDateBetween(Therapist therapist, Date startDate, Date endDate);

    /**
     * Find sessions by patient and therapist.
     * 
     * @param patient the patient
     * @param therapist the therapist
     * @return list of sessions between the patient and therapist
     */
    List<Session> findByPatientAndTherapist(Patient patient, Therapist therapist);

    /**
     * Find sessions by duration.
     * 
     * @param duration the session duration in minutes
     * @return list of sessions with the specified duration
     */
    List<Session> findByDuration(int duration);

    /**
     * Find sessions with duration greater than specified minutes.
     * 
     * @param minDuration the minimum duration in minutes
     * @return list of sessions longer than the minimum duration
     */
    List<Session> findByDurationGreaterThan(int minDuration);

    /**
     * Find sessions with notes containing the given text.
     * 
     * @param searchTerm the text to search for in notes
     * @return list of sessions whose notes contain the search term
     */
    List<Session> findByNotesContainingIgnoreCase(String searchTerm);

    /**
     * Find today's sessions for a specific therapist.
     * 
     * @param therapist the therapist
     * @return list of today's sessions for the therapist
     */
    @Query("SELECT s FROM Session s WHERE s.therapist = :therapist AND DATE(s.date) = CURRENT_DATE")
    List<Session> findTodaySessionsByTherapist(@Param("therapist") Therapist therapist);

    /**
     * Find upcoming sessions for a specific patient.
     * 
     * @param patient the patient
     * @return list of upcoming sessions for the patient
     */
    @Query("SELECT s FROM Session s WHERE s.patient = :patient AND s.date > CURRENT_TIMESTAMP ORDER BY s.date")
    List<Session> findUpcomingSessionsByPatient(@Param("patient") Patient patient);

    /**
     * Find past sessions for a specific patient.
     * 
     * @param patient the patient
     * @return list of past sessions for the patient
     */
    @Query("SELECT s FROM Session s WHERE s.patient = :patient AND s.date < CURRENT_TIMESTAMP ORDER BY s.date DESC")
    List<Session> findPastSessionsByPatient(@Param("patient") Patient patient);

    /**
     * Count sessions by patient.
     * 
     * @param patient the patient to count sessions for
     * @return number of sessions for the patient
     */
    long countByPatient(Patient patient);

    /**
     * Count sessions by therapist.
     * 
     * @param therapist the therapist to count sessions for
     * @return number of sessions for the therapist
     */
    long countByTherapist(Therapist therapist);

    /**
     * Find sessions ordered by date (most recent first).
     * 
     * @return list of sessions ordered by date descending
     */
    List<Session> findAllByOrderByDateDesc();

    /**
     * Find sessions scheduled for a specific date and therapist.
     * 
     * @param date the date
     * @param therapist the therapist
     * @return list of sessions for the therapist on the specified date
     */
    @Query("SELECT s FROM Session s WHERE DATE(s.date) = DATE(:date) AND s.therapist = :therapist ORDER BY s.date")
    List<Session> findSessionsByDateAndTherapist(@Param("date") Date date, @Param("therapist") Therapist therapist);

    /**
     * Calculate total session duration for a patient.
     * 
     * @param patient the patient
     * @return total duration in minutes
     */
    @Query("SELECT COALESCE(SUM(s.duration), 0) FROM Session s WHERE s.patient = :patient")
    Long calculateTotalDurationByPatient(@Param("patient") Patient patient);

    /**
     * Calculate total session duration for a therapist.
     * 
     * @param therapist the therapist
     * @return total duration in minutes
     */
    @Query("SELECT COALESCE(SUM(s.duration), 0) FROM Session s WHERE s.therapist = :therapist")
    Long calculateTotalDurationByTherapist(@Param("therapist") Therapist therapist);

    /**
     * Find sessions that need to be rescheduled (have conflicting times).
     * 
     * @param therapist the therapist
     * @param date the date to check
     * @return list of potentially conflicting sessions
     */
    @Query("SELECT s FROM Session s WHERE s.therapist = :therapist AND DATE(s.date) = DATE(:date)")
    List<Session> findPotentialConflicts(@Param("therapist") Therapist therapist, @Param("date") Date date);
}
