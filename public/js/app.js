'use strict';

/**
 * Hasard 2026 - Modern JavaScript Application
 * Uses Fetch API instead of XMLHttpRequest
 */
class HasardApp {
    constructor(config) {
        this.classeId = config.classeId;
        this.temps = config.temps || 'tous';
        this.csrfToken = config.csrfToken;
        this.init();
    }

    init() {
        this.bindResponseButtons();
    }

    async updateResponse(studentId, points, remarque = '') {
        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrfToken
                },
                body: JSON.stringify({
                    idstag: studentId,
                    idan: this.classeId,
                    points: points,
                    remarque: remarque
                })
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const result = await response.json();
            console.log('Update successful:', result);

            // Refresh stats and load new random student
            await Promise.all([
                this.refreshStats(),
                this.loadRandomStudent()
            ]);

            // Clear the remark field
            const remarqueField = document.getElementById('remarque');
            if (remarqueField) {
                remarqueField.value = '';
            }

        } catch (error) {
            console.error('Error updating response:', error);
            alert('Erreur lors de la mise a jour');
        }
    }

    async refreshStats() {
        try {
            const [generalResponse, equipeResponse] = await Promise.all([
                fetch(`/api/load/general?temps=${this.temps}&idan=${this.classeId}`),
                fetch(`/api/load/equipe?temps=${this.temps}&idan=${this.classeId}`)
            ]);

            const generalHtml = await generalResponse.text();
            const equipeHtml = await equipeResponse.text();

            const statsTotal = document.getElementById('statstotal');
            const updateAllStagiaires = document.getElementById('updateAllStagiaires');

            if (statsTotal) {
                statsTotal.innerHTML = generalHtml;
            }
            if (updateAllStagiaires) {
                updateAllStagiaires.innerHTML = equipeHtml;
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
        }
    }

    async loadRandomStudent() {
        try {
            const response = await fetch(`/api/load/hasard?idan=${this.classeId}`);

            if (!response.ok) {
                throw new Error('Failed to load random student');
            }

            const data = await response.json();

            // Update modal header
            const modalTitle = document.getElementById('staticBackdropLabel');
            if (modalTitle) {
                modalTitle.textContent = `Question pour ${data.prenom} ${data.nom.charAt(0)}.`;
            }

            // Update hidden fields
            const idstagiaire = document.getElementById('idstagiaire');
            if (idstagiaire) {
                idstagiaire.textContent = data.idstagiaires;
            }

        } catch (error) {
            console.error('Error loading random student:', error);
        }
    }

    bindResponseButtons() {
        const buttons = {
            'b3': 3, // Super reponse (+2)
            'b2': 2, // Bonne reponse (+1)
            'b1': 1, // Mauvaise (-1)
            'b0': 0  // Absent (-1)
        };

        Object.entries(buttons).forEach(([id, points]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    const studentId = document.getElementById('idstagiaire')?.textContent;
                    const remarque = document.getElementById('remarque')?.value || '';

                    if (studentId) {
                        this.updateResponse(parseInt(studentId), points, remarque);
                    }
                });
            }
        });
    }
}

// Global function for choosing a specific student (called from buttons)
function choix(idannee, idstagiaire, nom) {
    const idStagiaireEl = document.getElementById('idstagiaire');
    const idAnneeEl = document.getElementById('idannee');
    const modalTitle = document.getElementById('staticBackdropLabel');

    if (idStagiaireEl) {
        idStagiaireEl.textContent = idstagiaire;
    }
    if (idAnneeEl) {
        idAnneeEl.textContent = idannee;
    }
    if (modalTitle) {
        modalTitle.textContent = `Question pour ${nom}.`;
    }
}

// Global function for loading page content (called from close button)
function onLoadPage(containerId, type, temps, classeId) {
    if (window.app) {
        window.app.loadRandomStudent();
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const config = window.HASARD_CONFIG || {};
    if (config.classeId) {
        window.app = new HasardApp(config);
    }
});
