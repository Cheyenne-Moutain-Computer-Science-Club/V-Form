import { UserOptions } from "@/lib/types";

// ResponseQuestion is a class that contains necessary information for question results
export class ResponseQuestion {
    // questionText is the text of the question (the actual question)
    private questionText: string;
    // Options are the possible answers to the question
    private options: Array<UserOptions>;
    // num_total_responses is the total number of responses to the question
    private num_total_responses: number;

    public constructor(questionText: string, options: Array<UserOptions>, num_total_responses: number) {
        this.questionText = questionText;
        this.options = options;
        this.num_total_responses = num_total_responses;
    }

    public getQuestionText() {
        return this.questionText;
    }
    public getOptions() {
        return this.options;
    }
    public getNumTotalResponses() {
        return this.num_total_responses;
    }
    public setQuestionText(questionText: string) {
        this.questionText = questionText;
    }
    public setOptions(options: Array<UserOptions>) {
        this.options = options;
    }
    public setNumTotalResponses(num_total_responses: number) {
        this.num_total_responses = num_total_responses;
    }

    // sortOptions sorts the options by the number of times they were chosen, in descending order
    public sortOptions() {
        this.options.sort((a, b) => b.numChosen - a.numChosen);
    }
    public getPercent(itemIndex: number): number {
        let percent = this.options[itemIndex].numChosen / this.num_total_responses;
        percent = Math.round(percent * 1000) / 10;
        return percent; 
    }
}
