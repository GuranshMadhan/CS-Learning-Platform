package madhan.guransh.backend.repository;

import madhan.guransh.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findTop10ByOrderByXpDesc();

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.enrolledClassrooms c WHERE c.id = :classroomId ORDER BY u.xp DESC")
    Optional<List<User>> findLeaderboardByClassroom(Long classroomId);

    @Query("SELECT COUNT(u) + 1 FROM User u WHERE u.xp > :xp")
    int calculateRank(@Param("xp") int xp);
}
