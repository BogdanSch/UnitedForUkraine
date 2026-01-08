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
        const rfc5987Match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/
        );
        if (rfc5987Match && rfc5987Match[1]) {
          filename = decodeURIComponent(rfc5987Match[1]);
        } else {
          const fallbackMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (fallbackMatch && fallbackMatch[1]) filename = fallbackMatch[1];
        }
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
    setRequestError("");
  };
  return (
    <Card className="report__card  mt-4" isLite={false}>
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
          <div id="passwordHelpBlock" className="form-text mt-3">
            All fields marked with an asterisk (*) are required.
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-sky btn-icon">
            <i className="bi bi-filetype-xlsx"></i>
            <span className="small">Generate the report</span>
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
