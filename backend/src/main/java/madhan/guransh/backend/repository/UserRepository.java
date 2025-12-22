package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByXpDesc();

    @Query("SELECT u FROM User u JOIN u.enrolledClassrooms c WHERE c.id = :classroomId ORDER BY u.xp DESC")
    List<User> findLeaderboardByClassroom(Long classroomId);
}
