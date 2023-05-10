package org.sebi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.sebi.IntegrationTest;
import org.sebi.domain.Stroopsub;
import org.sebi.repository.StroopsubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StroopsubResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StroopsubResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stroopsubs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StroopsubRepository stroopsubRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStroopsubMockMvc;

    private Stroopsub stroopsub;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stroopsub createEntity(EntityManager em) {
        Stroopsub stroopsub = new Stroopsub().name(DEFAULT_NAME).amount(DEFAULT_AMOUNT).description(DEFAULT_DESCRIPTION);
        return stroopsub;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stroopsub createUpdatedEntity(EntityManager em) {
        Stroopsub stroopsub = new Stroopsub().name(UPDATED_NAME).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION);
        return stroopsub;
    }

    @BeforeEach
    public void initTest() {
        stroopsub = createEntity(em);
    }

    @Test
    @Transactional
    void createStroopsub() throws Exception {
        int databaseSizeBeforeCreate = stroopsubRepository.findAll().size();
        // Create the Stroopsub
        restStroopsubMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isCreated());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeCreate + 1);
        Stroopsub testStroopsub = stroopsubList.get(stroopsubList.size() - 1);
        assertThat(testStroopsub.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStroopsub.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testStroopsub.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createStroopsubWithExistingId() throws Exception {
        // Create the Stroopsub with an existing ID
        stroopsub.setId(1L);

        int databaseSizeBeforeCreate = stroopsubRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStroopsubMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStroopsubs() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        // Get all the stroopsubList
        restStroopsubMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stroopsub.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getStroopsub() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        // Get the stroopsub
        restStroopsubMockMvc
            .perform(get(ENTITY_API_URL_ID, stroopsub.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stroopsub.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingStroopsub() throws Exception {
        // Get the stroopsub
        restStroopsubMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStroopsub() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();

        // Update the stroopsub
        Stroopsub updatedStroopsub = stroopsubRepository.findById(stroopsub.getId()).get();
        // Disconnect from session so that the updates on updatedStroopsub are not directly saved in db
        em.detach(updatedStroopsub);
        updatedStroopsub.name(UPDATED_NAME).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION);

        restStroopsubMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStroopsub.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStroopsub))
            )
            .andExpect(status().isOk());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
        Stroopsub testStroopsub = stroopsubList.get(stroopsubList.size() - 1);
        assertThat(testStroopsub.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStroopsub.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testStroopsub.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stroopsub.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStroopsubWithPatch() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();

        // Update the stroopsub using partial update
        Stroopsub partialUpdatedStroopsub = new Stroopsub();
        partialUpdatedStroopsub.setId(stroopsub.getId());

        partialUpdatedStroopsub.name(UPDATED_NAME);

        restStroopsubMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStroopsub.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStroopsub))
            )
            .andExpect(status().isOk());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
        Stroopsub testStroopsub = stroopsubList.get(stroopsubList.size() - 1);
        assertThat(testStroopsub.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStroopsub.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testStroopsub.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateStroopsubWithPatch() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();

        // Update the stroopsub using partial update
        Stroopsub partialUpdatedStroopsub = new Stroopsub();
        partialUpdatedStroopsub.setId(stroopsub.getId());

        partialUpdatedStroopsub.name(UPDATED_NAME).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION);

        restStroopsubMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStroopsub.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStroopsub))
            )
            .andExpect(status().isOk());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
        Stroopsub testStroopsub = stroopsubList.get(stroopsubList.size() - 1);
        assertThat(testStroopsub.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStroopsub.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testStroopsub.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stroopsub.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStroopsub() throws Exception {
        int databaseSizeBeforeUpdate = stroopsubRepository.findAll().size();
        stroopsub.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStroopsubMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stroopsub))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stroopsub in the database
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStroopsub() throws Exception {
        // Initialize the database
        stroopsubRepository.saveAndFlush(stroopsub);

        int databaseSizeBeforeDelete = stroopsubRepository.findAll().size();

        // Delete the stroopsub
        restStroopsubMockMvc
            .perform(delete(ENTITY_API_URL_ID, stroopsub.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stroopsub> stroopsubList = stroopsubRepository.findAll();
        assertThat(stroopsubList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
