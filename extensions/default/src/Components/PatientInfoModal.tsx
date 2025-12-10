import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Icons } from '@ohif/ui-next';
import usePatientInfo from '../hooks/usePatientInfo';

/**
 * PatientInfoModal Component
 * 
 * Displays patient and study information in a modal dialog.
 * Accessed via a button in the header's right section.
 * 
 * Features:
 * - Shows patient demographics (name, ID, sex, DOB)
 * - Displays active study/series information
 * - Handles mixed patient scenarios
 * - Uses i18n for translations
 */
function PatientInfoModal({ servicesManager, appConfig }: withAppTypes): React.ReactNode {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('PatientInfoModal');
  const { patientInfo, isMixedPatients } = usePatientInfo(servicesManager);

  const { displaySetService } = servicesManager.services;
  const activeDisplaySets = displaySetService.getActiveDisplaySets();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="text-primary hover:bg-primary-dark rounded p-2 transition-colors duration-200"
        title={t('title', 'Patient Information')}
        aria-label={t('title', 'Patient Information')}
      >
        {isMixedPatients ? (
          <Icons.MultiplePatients className="h-6 w-6" />
        ) : (
          <Icons.Patient className="h-6 w-6" />
        )}
      </button>

      {/* Modal Content */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-primary-dark bg-black p-6 text-white shadow-lg">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">
                {t('title', 'Patient Information')}
              </h2>
              <button
                onClick={handleClose}
                className="text-primary hover:text-primary-light rounded p-1 transition-colors"
                aria-label="Close"
              >
                <Icons.X className="h-6 w-6" />
              </button>
            </div>

            {/* Patient Info Section */}
            {!isMixedPatients ? (
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-aqua-pale">
                  {t('patientDetails', 'Patient Details')}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Patient Name */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-xs font-semibold uppercase text-aqua-pale">
                      {t('patientName', 'Patient Name')}
                    </label>
                    <div className="text-sm font-semibold text-white">
                      {patientInfo.PatientName || 'N/A'}
                    </div>
                  </div>

                  {/* Patient ID */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-xs font-semibold uppercase text-aqua-pale">
                      {t('patientID', 'Patient ID')}
                    </label>
                    <div className="break-all text-sm font-semibold text-white">
                      {patientInfo.PatientID || 'N/A'}
                    </div>
                  </div>

                  {/* Patient Sex */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-xs font-semibold uppercase text-aqua-pale">
                      {t('sex', 'Sex')}
                    </label>
                    <div className="text-sm font-semibold text-white">
                      {patientInfo.PatientSex || 'N/A'}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-xs font-semibold uppercase text-aqua-pale">
                      {t('dateOfBirth', 'Date of Birth')}
                    </label>
                    <div className="text-sm font-semibold text-white">
                      {patientInfo.PatientDOB || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-lg border border-yellow-600 bg-yellow-900/20 p-4">
                <div className="flex items-start gap-3">
                  <Icons.Warning className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                  <div>
                    <h4 className="font-semibold text-yellow-400">
                      {t('multiplePatientsTitle', 'Multiple Patients Detected')}
                    </h4>
                    <p className="mt-1 text-sm text-yellow-300">
                      {t(
                        'multiplePatientsWarning',
                        'The current study contains images from multiple patients. Patient information is not displayed for safety reasons.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Studies Information Section */}
            <div className="border-t border-primary-dark pt-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-aqua-pale">
                {t('studiesInformation', 'Studies Information')}
              </h3>

              {activeDisplaySets.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {activeDisplaySets.map((displaySet, idx) => {
                    const instance = displaySet?.instances?.[0] || displaySet?.instance;
                    return instance ? (
                      <div
                        key={idx}
                        className="rounded border border-primary-dark bg-primary-dark/30 p-3 text-xs"
                      >
                        <div className="mb-2 flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span className="font-semibold text-aqua-pale">
                              {t('modality', 'Modality')}:
                            </span>
                            <span className="text-white">{displaySet.Modality || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-aqua-pale">
                              {t('studyDate', 'Study Date')}:
                            </span>
                            <span className="text-white">{instance.StudyDate || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-aqua-pale">
                              {t('description', 'Description')}:
                            </span>
                            <span className="break-all text-white">
                              {displaySet.SeriesDescription || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="rounded border border-primary-dark bg-primary-dark/30 p-4 text-center text-sm text-aqua-pale">
                  {t('noStudiesAvailable', 'No studies available')}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-primary-dark text-primary hover:bg-primary-dark"
              >
                {t('close', 'Close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

export default PatientInfoModal;
