import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../utils/LoadingSpinner";
import ReportStamp from "./ReportStamp";

const Reports: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [reports, setReports] = useState<any[]>([]);

  const deleteReport = async (reportId: string) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/report/deletereport/" + reportId,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData.success) {
        setReports((rep) => {
          let newReports = rep.filter((r) => r._id.$oid !== reportId);
          return newReports;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/report/getreport/" + auth.userId,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setReports(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReports();
  }, [sendRequest, auth.token, auth.userId]);
  
  return (
    <div>
      {isLoading ? (
        <div style={{ paddingTop: "200px" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          {reports.length > 0 ? (
            <div>
              {reports.map((r, i) => (
                <div key={i} style={{ padding: "10px" }}>
                  <ReportStamp
                    key={i}
                    results={r.results}
                    reportId={r._id.$oid}
                    name={r.name}
                    Date={r.Date}
                    Time={r.Time}
                    deleteReport={deleteReport}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: "200px",
                fontSize: "30px",
              }}
            >
              No Reports Found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
