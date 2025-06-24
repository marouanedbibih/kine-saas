package org.kine.backend.config.db;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kine.backend.modules.user.UserRepository;
import org.kine.backend.enums.Gender;
import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.admin.Admin;
import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.cabinet.CabinetRepository;
import org.kine.backend.modules.medical_document.MedicalDocument;
import org.kine.backend.modules.medical_document.MedicalDocumentRepository;
import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.patient.PatientRepository;
import org.kine.backend.modules.session.Session;
import org.kine.backend.modules.session.SessionRepository;
import org.kine.backend.modules.therapist.Therapist;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * Class to initialize the database with test data.
 * Only runs when the 'dev' profile is active.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class InitDatabase {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabaseData(
            UserRepository userRepository,
            CabinetRepository cabinetRepository,
            PatientRepository patientRepository,
            SessionRepository sessionRepository,
            MedicalDocumentRepository medicalDocumentRepository) {
        return args -> {
            log.info("Starting database initialization...");
            
            // Create cabinets
            Cabinet mainCabinet = createMainCabinet(cabinetRepository);
            Cabinet secondaryCabinet = createSecondaryCabinet(cabinetRepository);
            
            // Create admin users
            Admin admin1 = createAdmin1(userRepository);
            Admin admin2 = createAdmin2(userRepository);
            
            // Create therapists
            Therapist therapist1 = createTherapist1(userRepository, mainCabinet);
            Therapist therapist2 = createTherapist2(userRepository, mainCabinet);
            Therapist therapist3 = createTherapist3(userRepository, secondaryCabinet);
            
            // Create patients
            Patient patient1 = createPatient1(patientRepository, mainCabinet);
            Patient patient2 = createPatient2(patientRepository, mainCabinet);
            Patient patient3 = createPatient3(patientRepository, secondaryCabinet);
            Patient patient4 = createPatient4(patientRepository, secondaryCabinet);
            
            // Create sessions
            createSessions(sessionRepository, therapist1, therapist2, therapist3, patient1, patient2, patient3, patient4);
            
            // Create medical documents
            createMedicalDocuments(medicalDocumentRepository, therapist1, therapist2, patient1, patient2, patient3);
            
            log.info("Database initialization completed successfully!");
        };
    }

    private Cabinet createMainCabinet(CabinetRepository cabinetRepository) {
        Cabinet cabinet = Cabinet.builder()
                .name("Main Physiotherapy Clinic")
                .address("123 Health Street")
                .city("Wellville")
                .phone("555-123-4567")
                .build();
        
        return cabinetRepository.save(cabinet);
    }

    private Cabinet createSecondaryCabinet(CabinetRepository cabinetRepository) {
        Cabinet cabinet = Cabinet.builder()
                .name("Downtown Rehabilitation Center")
                .address("456 Therapy Avenue")
                .city("Healington")
                .phone("555-987-6543")
                .build();
        
        return cabinetRepository.save(cabinet);
    }

    private Admin createAdmin1(UserRepository userRepository) {
        Admin admin = new Admin();
        admin.setEmail("admin@kine.org");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setFullName("John Administrator");
        admin.setEnabled(true);
        admin.setAccountNonExpired(true);
        admin.setAccountNonLocked(true);
        admin.setCredentialsNonExpired(true);
        
        return (Admin) userRepository.save(admin);
    }

    private Admin createAdmin2(UserRepository userRepository) {
        Admin admin = new Admin();
        admin.setEmail("maria@kine.org");
        admin.setPassword(passwordEncoder.encode("maria123"));
        admin.setRole(UserRole.ADMIN);
        admin.setFullName("Maria Rodriguez");
        admin.setEnabled(true);
        admin.setAccountNonExpired(true);
        admin.setAccountNonLocked(true);
        admin.setCredentialsNonExpired(true);
        
        return (Admin) userRepository.save(admin);
    }

    private Therapist createTherapist1(UserRepository userRepository, Cabinet cabinet) {
        Therapist therapist = new Therapist();
        therapist.setEmail("sarah@kine.org");
        therapist.setPassword(passwordEncoder.encode("sarah123"));
        therapist.setRole(UserRole.THERAPIST);
        therapist.setFirstName("Sarah");
        therapist.setLastName("Johnson");
        therapist.setPhone("555-222-3333");
        therapist.setSpecialty("Sports Rehabilitation");
        therapist.setCabinet(cabinet);
        therapist.setEnabled(true);
        therapist.setAccountNonExpired(true);
        therapist.setAccountNonLocked(true);
        therapist.setCredentialsNonExpired(true);
        
        return (Therapist) userRepository.save(therapist);
    }

    private Therapist createTherapist2(UserRepository userRepository, Cabinet cabinet) {
        Therapist therapist = new Therapist();
        therapist.setEmail("michael@kine.org");
        therapist.setPassword(passwordEncoder.encode("michael123"));
        therapist.setRole(UserRole.THERAPIST);
        therapist.setFirstName("Michael");
        therapist.setLastName("Chen");
        therapist.setPhone("555-444-5555");
        therapist.setSpecialty("Geriatric Physiotherapy");
        therapist.setCabinet(cabinet);
        therapist.setEnabled(true);
        therapist.setAccountNonExpired(true);
        therapist.setAccountNonLocked(true);
        therapist.setCredentialsNonExpired(true);
        
        return (Therapist) userRepository.save(therapist);
    }

    private Therapist createTherapist3(UserRepository userRepository, Cabinet cabinet) {
        Therapist therapist = new Therapist();
        therapist.setEmail("amara@kine.org");
        therapist.setPassword(passwordEncoder.encode("amara123"));
        therapist.setRole(UserRole.THERAPIST);
        therapist.setFirstName("Amara");
        therapist.setLastName("Okafor");
        therapist.setPhone("555-666-7777");
        therapist.setSpecialty("Pediatric Physiotherapy");
        therapist.setCabinet(cabinet);
        therapist.setEnabled(true);
        therapist.setAccountNonExpired(true);
        therapist.setAccountNonLocked(true);
        therapist.setCredentialsNonExpired(true);
        
        return (Therapist) userRepository.save(therapist);
    }

    private Patient createPatient1(PatientRepository patientRepository, Cabinet cabinet) {
        Patient patient = Patient.builder()
                .firstName("Robert")
                .lastName("Smith")
                .middleName("James")
                .dateOfBirth(convertToDateViaInstant(LocalDate.of(1980, 5, 15)))
                .gender(Gender.MALE)
                .address("789 Recovery Road")
                .city("Wellville")
                .state("Healthstate")
                .zipCode("12345")
                .phone("555-111-2222")
                .email("robert@example.com")
                .emergencyContactName("Susan Smith")
                .emergencyContactPhone("555-999-8888")
                .emergencyContactRelation("Spouse")
                .cabinet(cabinet)
                .build();
        
        return patientRepository.save(patient);
    }

    private Patient createPatient2(PatientRepository patientRepository, Cabinet cabinet) {
        Patient patient = Patient.builder()
                .firstName("Jennifer")
                .lastName("Garcia")
                .dateOfBirth(convertToDateViaInstant(LocalDate.of(1992, 8, 22)))
                .gender(Gender.FEMALE)
                .address("456 Healing Lane")
                .city("Wellville")
                .state("Healthstate")
                .zipCode("12345")
                .phone("555-333-4444")
                .email("jennifer@example.com")
                .emergencyContactName("Carlos Garcia")
                .emergencyContactPhone("555-777-6666")
                .emergencyContactRelation("Brother")
                .cabinet(cabinet)
                .build();
        
        return patientRepository.save(patient);
    }

    private Patient createPatient3(PatientRepository patientRepository, Cabinet cabinet) {
        Patient patient = Patient.builder()
                .firstName("Ahmed")
                .lastName("Hassan")
                .dateOfBirth(convertToDateViaInstant(LocalDate.of(1975, 3, 10)))
                .gender(Gender.MALE)
                .address("123 Therapy Street")
                .city("Healington")
                .state("Healthstate")
                .zipCode("67890")
                .phone("555-555-1212")
                .email("ahmed@example.com")
                .emergencyContactName("Fatima Hassan")
                .emergencyContactPhone("555-212-3434")
                .emergencyContactRelation("Wife")
                .cabinet(cabinet)
                .build();
        
        return patientRepository.save(patient);
    }

    private Patient createPatient4(PatientRepository patientRepository, Cabinet cabinet) {
        Patient patient = Patient.builder()
                .firstName("Olivia")
                .lastName("Wang")
                .dateOfBirth(convertToDateViaInstant(LocalDate.of(2010, 11, 30)))
                .gender(Gender.FEMALE)
                .address("567 Wellness Avenue")
                .city("Healington")
                .state("Healthstate")
                .zipCode("67890")
                .phone("555-888-9999")
                .altPhone("555-000-1111")
                .email("olivia.parents@example.com")
                .emergencyContactName("Li Wang")
                .emergencyContactPhone("555-234-5678")
                .emergencyContactRelation("Father")
                .cabinet(cabinet)
                .build();
        
        return patientRepository.save(patient);
    }

    private void createSessions(SessionRepository sessionRepository,
                              Therapist therapist1, Therapist therapist2, Therapist therapist3,
                              Patient patient1, Patient patient2, Patient patient3, Patient patient4) {
        // Future sessions
        LocalDateTime now = LocalDateTime.of(2025, 6, 21, 22, 6, 35);
        
        // Session 1 - Today
        Session session1 = Session.builder()
                .date(convertToDateViaInstant(now.plusHours(1)))
                .duration(60)
                .notes("Initial assessment for knee rehabilitation")
                .patient(patient1)
                .therapist(therapist1)
                .build();
        sessionRepository.save(session1);
        
        // Session 2 - Tomorrow
        Session session2 = Session.builder()
                .date(convertToDateViaInstant(now.plusDays(1)))
                .duration(45)
                .notes("Follow-up session for shoulder pain")
                .patient(patient2)
                .therapist(therapist1)
                .build();
        sessionRepository.save(session2);
        
        // Session 3 - Next week
        Session session3 = Session.builder()
                .date(convertToDateViaInstant(now.plusDays(7)))
                .duration(30)
                .notes("Geriatric assessment")
                .patient(patient3)
                .therapist(therapist2)
                .build();
        sessionRepository.save(session3);
        
        // Session 4 - Next week
        Session session4 = Session.builder()
                .date(convertToDateViaInstant(now.plusDays(8)))
                .duration(60)
                .notes("Pediatric mobility exercises")
                .patient(patient4)
                .therapist(therapist3)
                .build();
        sessionRepository.save(session4);
        
        // Past sessions
        Session session5 = Session.builder()
                .date(convertToDateViaInstant(now.minusDays(7)))
                .duration(45)
                .notes("Completed lower back assessment. Patient shows improvement.")
                .patient(patient1)
                .therapist(therapist1)
                .build();
        sessionRepository.save(session5);
        
        Session session6 = Session.builder()
                .date(convertToDateViaInstant(now.minusDays(14)))
                .duration(60)
                .notes("Initial consultation. Patient complains of chronic knee pain.")
                .patient(patient2)
                .therapist(therapist2)
                .build();
        sessionRepository.save(session6);
    }

    private void createMedicalDocuments(MedicalDocumentRepository medicalDocumentRepository,
                                      Therapist therapist1, Therapist therapist2,
                                      Patient patient1, Patient patient2, Patient patient3) {
        LocalDateTime now = LocalDateTime.of(2025, 6, 21, 22, 6, 35);
        
        // Document 1
        MedicalDocument document1 = MedicalDocument.builder()
                .title("MRI Results")
                .description("MRI scan of right knee showing meniscus tear")
                .fileUrl("https://storage.kine.org/docs/mri-patient1-202506.pdf")
                .uploadedAt(convertToDateViaInstant(now.minusDays(10)))
                .patient(patient1)
                .build();
        medicalDocumentRepository.save(document1);
        
        // Document 2
        MedicalDocument document2 = MedicalDocument.builder()
                .title("Rehabilitation Plan")
                .description("8-week rehabilitation plan for knee recovery")
                .fileUrl("https://storage.kine.org/docs/rehab-plan-patient1-202506.pdf")
                .uploadedAt(convertToDateViaInstant(now.minusDays(9)))
                .patient(patient1)
                .build();
        medicalDocumentRepository.save(document2);
        
        // Document 3
        MedicalDocument document3 = MedicalDocument.builder()
                .title("X-Ray Results")
                .description("X-ray of shoulder showing no fractures")
                .fileUrl("https://storage.kine.org/docs/xray-patient2-202505.pdf")
                .uploadedAt(convertToDateViaInstant(now.minusDays(30)))
                .patient(patient2)
                .build();
        medicalDocumentRepository.save(document3);
        
        // Document 4
        MedicalDocument document4 = MedicalDocument.builder()
                .title("Medical History - Confidential")
                .description("Complete medical history including pre-existing conditions")
                .fileUrl("https://storage.kine.org/docs/history-patient3-202506.pdf")
                .uploadedAt(convertToDateViaInstant(now.minusDays(5)))
                .patient(patient3)
                .build();
        medicalDocumentRepository.save(document4);
    }
    
    // Helper method to convert LocalDate to Date
    private Date convertToDateViaInstant(LocalDateTime dateTime) {
        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
    
    // Helper method to convert LocalDate to Date
    private Date convertToDateViaInstant(LocalDate date) {
        return Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}