package org.sebi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.sebi.web.rest.TestUtil;

class StroopsubTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stroopsub.class);
        Stroopsub stroopsub1 = new Stroopsub();
        stroopsub1.setId(1L);
        Stroopsub stroopsub2 = new Stroopsub();
        stroopsub2.setId(stroopsub1.getId());
        assertThat(stroopsub1).isEqualTo(stroopsub2);
        stroopsub2.setId(2L);
        assertThat(stroopsub1).isNotEqualTo(stroopsub2);
        stroopsub1.setId(null);
        assertThat(stroopsub1).isNotEqualTo(stroopsub2);
    }
}
