import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useState } from "react";
import { useCustomForm } from "../../../hooks";
import { Card, ErrorAlert, Input } from "../../../components";
import { DateRange } from "../../../types";
import { API_URL } from "../../../variables";
import { isNullOrWhitespace } from "../../../utils/helpers/stringHelper";

const getDefaultData = (): DateRange => ({
  startDate: "",
  endDate: "",
});

const FoundationReportForm: FC = () => {
  const [formData, setFormData] = useState<DateRange>(getDefaultData());
  //   const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");
  const { handleDateChange } = useCustomForm(setFormData);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await protectedAxios.get(
        `${API_URL}/reports?start=${formData.startDate}&end=${formData.endDate}`,
        { responseType: "blob" }
      );
      const contentDisposition = response.headers["content-disposition"];
      let filename = "report.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setRequestError("Failed to create the report. Please, try again later!");
      console.error("Error creating payment session:", error);
    }
  };
  const handleReset = (): void => {
    setFormData(getDefaultData());
  };
  return (
    <Card className="report__card" isLite={false}>
      {!isNullOrWhitespace(requestError) && (
        <ErrorAlert errorMessage={requestError} />
      )}
      <form
        className="form report__form"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <div className="mb-3">
          <label htmlFor="startDateInput" className="form-label">
            Start date*
          </label>
          <Input
            type="date"
            name="startDate"
            id="startDateInput"
            value={formData.startDate}
            onChange={handleDateChange}
            isRequired={true}
          />
          {/* {!isNullOrWhitespace(errors.startDate) && (
            <ErrorAlert errorMessage={errors.startDate} />
          )} */}
        </div>
        <div className="mb-3">
          <label htmlFor="endDateInput" className="form-label">
            End date*
          </label>
          <Input
            type="date"
            name="endDate"
            id="endDateInput"
            value={formData.endDate}
            onChange={handleDateChange}
            isRequired={true}
          />
          {/* {!isNullOrWhitespace(errors.endDate) && (
            <ErrorAlert errorMessage={errors.endDate} />
          )} */}
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Create the report
          </button>
          <button type="reset" className="btn btn-outline-danger">
            Reset
          </button>
        </div>
      </form>
    </Card>
  );
};

export default FoundationReportForm;
