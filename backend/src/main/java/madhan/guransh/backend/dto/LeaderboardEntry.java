package madhan.guransh.backend.dto;

import lombok.Data;

@Data
public class LeaderboardEntry {
    private String username;
    private int xp;
    private int rank;

    public LeaderboardEntry(String username, int xp, int rank) {
        this.username = username;
        this.xp = xp;
        this.rank = rank;
    }
}
