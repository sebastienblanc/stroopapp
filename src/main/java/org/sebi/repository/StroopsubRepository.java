package org.sebi.repository;

import org.sebi.domain.Stroopsub;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Stroopsub entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StroopsubRepository extends JpaRepository<Stroopsub, Long> {}
