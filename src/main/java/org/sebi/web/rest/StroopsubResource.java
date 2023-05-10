package org.sebi.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.sebi.domain.Stroopsub;
import org.sebi.repository.StroopsubRepository;
import org.sebi.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.sebi.domain.Stroopsub}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StroopsubResource {

    private final Logger log = LoggerFactory.getLogger(StroopsubResource.class);

    private static final String ENTITY_NAME = "stroopsub";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StroopsubRepository stroopsubRepository;

    public StroopsubResource(StroopsubRepository stroopsubRepository) {
        this.stroopsubRepository = stroopsubRepository;
    }

    /**
     * {@code POST  /stroopsubs} : Create a new stroopsub.
     *
     * @param stroopsub the stroopsub to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stroopsub, or with status {@code 400 (Bad Request)} if the stroopsub has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stroopsubs")
    public ResponseEntity<Stroopsub> createStroopsub(@RequestBody Stroopsub stroopsub) throws URISyntaxException {
        log.debug("REST request to save Stroopsub : {}", stroopsub);
        if (stroopsub.getId() != null) {
            throw new BadRequestAlertException("A new stroopsub cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stroopsub result = stroopsubRepository.save(stroopsub);
        return ResponseEntity
            .created(new URI("/api/stroopsubs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stroopsubs/:id} : Updates an existing stroopsub.
     *
     * @param id the id of the stroopsub to save.
     * @param stroopsub the stroopsub to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stroopsub,
     * or with status {@code 400 (Bad Request)} if the stroopsub is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stroopsub couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stroopsubs/{id}")
    public ResponseEntity<Stroopsub> updateStroopsub(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Stroopsub stroopsub
    ) throws URISyntaxException {
        log.debug("REST request to update Stroopsub : {}, {}", id, stroopsub);
        if (stroopsub.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stroopsub.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stroopsubRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Stroopsub result = stroopsubRepository.save(stroopsub);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stroopsub.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stroopsubs/:id} : Partial updates given fields of an existing stroopsub, field will ignore if it is null
     *
     * @param id the id of the stroopsub to save.
     * @param stroopsub the stroopsub to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stroopsub,
     * or with status {@code 400 (Bad Request)} if the stroopsub is not valid,
     * or with status {@code 404 (Not Found)} if the stroopsub is not found,
     * or with status {@code 500 (Internal Server Error)} if the stroopsub couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stroopsubs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stroopsub> partialUpdateStroopsub(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Stroopsub stroopsub
    ) throws URISyntaxException {
        log.debug("REST request to partial update Stroopsub partially : {}, {}", id, stroopsub);
        if (stroopsub.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stroopsub.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stroopsubRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stroopsub> result = stroopsubRepository
            .findById(stroopsub.getId())
            .map(existingStroopsub -> {
                if (stroopsub.getName() != null) {
                    existingStroopsub.setName(stroopsub.getName());
                }
                if (stroopsub.getAmount() != null) {
                    existingStroopsub.setAmount(stroopsub.getAmount());
                }
                if (stroopsub.getDescription() != null) {
                    existingStroopsub.setDescription(stroopsub.getDescription());
                }

                return existingStroopsub;
            })
            .map(stroopsubRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stroopsub.getId().toString())
        );
    }

    /**
     * {@code GET  /stroopsubs} : get all the stroopsubs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stroopsubs in body.
     */
    @GetMapping("/stroopsubs")
    public List<Stroopsub> getAllStroopsubs() {
        log.debug("REST request to get all Stroopsubs");
        return stroopsubRepository.findAll();
    }

    /**
     * {@code GET  /stroopsubs/:id} : get the "id" stroopsub.
     *
     * @param id the id of the stroopsub to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stroopsub, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stroopsubs/{id}")
    public ResponseEntity<Stroopsub> getStroopsub(@PathVariable Long id) {
        log.debug("REST request to get Stroopsub : {}", id);
        Optional<Stroopsub> stroopsub = stroopsubRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stroopsub);
    }

    /**
     * {@code DELETE  /stroopsubs/:id} : delete the "id" stroopsub.
     *
     * @param id the id of the stroopsub to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stroopsubs/{id}")
    public ResponseEntity<Void> deleteStroopsub(@PathVariable Long id) {
        log.debug("REST request to delete Stroopsub : {}", id);
        stroopsubRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
